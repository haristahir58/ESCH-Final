const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ShopkeeperOrder = require('../../model/order/ShopkeeperOrder');
const authenticate = require("../../../Distributor/middleware/authenticate")
const Sell = require('../../../SoleDistributor/model/Sell/sellSchema')

router.post('/shopkeeper/placeOrder', async (req, res) => {
      const { shop, orderItems } = req.body;
  
      // Validate if the required fields are present
      if (!shop || !orderItems || orderItems.length === 0) {
        return res.status(400).json({ error: 'Invalid request. Please provide shop and orderItems.' });
      }
      const newOrder = new ShopkeeperOrder({shop, orderItems, Date: new Date(),status: 'pending', });
        
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
  
      await newOrder.save();
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Error placing order:', error); // Log the error
      res.status(500).json({ message: 'Error placing order' });
    }
  });
  
    // Route to fetch all orders
// Route to fetch pending orders
  router.get('/shopkeeper/orders', async (req, res) => {
    try {
        const pendingOrders = await ShopkeeperOrder.find({ status: 'pending' })
       .populate({
        path: 'orderItems.product',
        model: 'Products',
        select: 'title imageUrl', // Specify the fields you want to select
      })
      .sort({ Date: -1 })
  
        // Map the pending orders to include product titles and user email and name
        const pendingOrdersWithProductTitles = pendingOrders.map((order) => ({
            _id: order._id,
            shop: order.shop,
            Date: order.Date,
            status: order.status,
            orderItems: order.orderItems.map((item) => ({
              product: {
                title: item.product.title,
                imageUrl: item.product.imageUrl,
              },
                quantity: item.quantity,
                total: item.total,
            })),
        }));
  
        res.json(pendingOrdersWithProductTitles);
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ message: 'Error fetching pending orders' });
    }
  });
  

  // Route to fetch accepted and rejected orders
router.get('/shopkeeper/orders/history', async (req, res) => {
  try {
      const historyOrders = await ShopkeeperOrder.find({ status: { $in: ['accepted', 'rejected'] }})
        .populate({
            path: 'orderItems.product',
            model: 'Products',
            select: 'title imageUrl', // Specify the fields you want to select
          })
          .sort({ Date: -1 })

      // Map the history orders to include product titles and user email and name
      const historyOrdersWithProductTitles = historyOrders.map((order) => ({
        _id: order._id,
          shop: order.shop,
          Date: order.Date,
          status: order.status,
          orderItems: order.orderItems.map((item) => ({
            product: {
              title: item.product.title,
              imageUrl: item.product.imageUrl,
            },
              quantity: item.quantity,
              total: item.total,
          })),
      }));

      res.json(historyOrdersWithProductTitles);
  } catch (error) {
      console.error('Error fetching order history:', error);
      res.status(500).json({ message: 'Error fetching order history' });
  }
});


router.get('/shopkeeper/orders/history/:id', async (req, res) => {
  const orderId = req.params.id;
  try {
    const historyOrder = await ShopkeeperOrder.findOne({ _id: orderId, status: { $in: ['accepted', 'rejected'] } })
      .populate({
        path: 'orderItems.product',
        model: 'Products',
        select: 'title imageUrl', // Specify the fields you want to select
      });

    if (!historyOrder) {
      return res.status(404).json({ message: 'Order not found in history' });
    }

    // Map the order to include product titles and user email and name
    const historyOrderWithProductTitles = {
      _id: historyOrder._id,
      shop: historyOrder.shop,
      Date: historyOrder.Date,
      status: historyOrder.status,
      orderItems: historyOrder.orderItems.map((item) => ({
        product: {
          title: item.product.title,
          imageUrl: item.product.imageUrl,
        },
        quantity: item.quantity,
        total: item.total,
      })),
    };

    res.json(historyOrderWithProductTitles);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Error fetching order history' });
  }
});
  


/// Specific Sole Distributor new order details
router.get('/shopkeeper/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  try {
    const pendingOrder = await ShopkeeperOrder.findOne({ _id: orderId, status: 'pending' })
      .populate({
        path: 'orderItems.product',
        model: 'Products',
        select: 'title imageUrl', // Specify the fields you want to select
      })
      .sort({ Date: -1 });

    // Check if there is a pendingOrder
    if (!pendingOrder) {
      return res.status(404).json({ message: 'No pending order found' });
    }

    // Map the pending order to include product titles and user email and name
    const pendingOrderWithProductTitles = {
      _id: pendingOrder._id,
      shop: pendingOrder.shop,
      Date: pendingOrder.Date,
      status: pendingOrder.status,
      orderItems: pendingOrder.orderItems.map((item) => ({
        product: {
          title: item.product.title,
          imageUrl: item.product.imageUrl,
        },
        quantity: item.quantity,
        total: item.total,
      })),
    };

    res.json(pendingOrderWithProductTitles);
  } catch (error) {
    console.error('Error fetching pending order:', error);
    res.status(500).json({ message: 'Error fetching pending order' });
  }
});



  
  

// Cancel Order
router.delete('/shopkeeper/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  try {
    const deletedOrder = await ShopkeeperOrder.findOneAndDelete({ _id: orderId });
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order canceled successfully' });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ message: 'Error canceling order' });
  }
});


// Distributor Routes for seeing new orders that are currently in pending state
router.get('/distributor/orders',authenticate, async (req, res) => {
  try {
    // Fetch pending orders first and sort them by Date in descending order
    const pendingOrders = await ShopkeeperOrder.find({ status: 'pending' })
      .populate({
        path: 'orderItems.product',
        model: 'Products',
        select: 'title imageUrl', // Specify the fields you want to select
      })
      .sort({ Date: -1 }); // Sort by Date in descending order

    const ordersWithProductTitles = pendingOrders.map((order) => ({
      _id: order._id,
      shop: order.shop,
      Date: order.Date,
      status: order.status,
      orderItems: order.orderItems.map((item) => ({
        product: {
          title: item.product.title,
          imageUrl: item.product.imageUrl,
        },
        quantity: item.quantity,
        total: item.total,
      })),
    }));

    res.json(ordersWithProductTitles);
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ message: 'Error fetching pending orders' });
  }
});



// Admin Route for viewing order history (accepted or rejected orders)
router.get('/distributor/orders/history', authenticate,  async (req, res) => {
  try {
    const historyOrders = await ShopkeeperOrder.find({ status: { $in: ['accepted', 'rejected'] } })
      .populate({
        path: 'orderItems.product',
        model: 'Products',
        select: 'title imageUrl', // Specify the fields you want to select
      })
      .sort({ Date: -1 });

    const ordersWithProductTitles = historyOrders.map((order) => ({
      _id: order._id,
      shop: order.shop,
      Date: order.Date,
      status: order.status,
      orderItems: order.orderItems.map((item) => ({
        product: {
          title: item.product.title,
          imageUrl: item.product.imageUrl,
        },
        quantity: item.quantity,
        total: item.total,
      })),
    }));

    res.json(ordersWithProductTitles);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Error fetching order history' });
  }
});

// specific order history

// Admin Route for getting a specific order from history by ID
router.get('/distributor/orders/history/:id', authenticate, async (req, res) => {
  const orderId = req.params.id;

  try {
    const specificOrder = await ShopkeeperOrder.findOne({ _id: orderId, status: { $in: ['accepted', 'rejected'] } })
      .populate({
        path: 'orderItems.product',
        model: 'Products',
        select: 'title imageUrl', // Specify the fields you want to select
      });

    if (!specificOrder) {
      return res.status(404).json({ message: 'Order not found in history' });
    }

    const orderDetails = {
      _id: specificOrder._id,
      shop: specificOrder.shop,
      Date: specificOrder.Date,
      status: specificOrder.status,
      orderItems: specificOrder.orderItems.map((item) => ({
        product: {
          title: item.product.title,
          imageUrl: item.product.imageUrl,
        },
        quantity: item.quantity,
        total: item.total,
      })),
    };

    res.json(orderDetails);
  } catch (error) {
    console.error('Error fetching specific order from history:', error);
    res.status(500).json({ message: 'Error fetching specific order from history' });
  }
});


//specific new order
// Admin Route for getting a specific order by ID
router.get('/distributor/orders/:id', authenticate, async (req, res) => {
  const orderId = req.params.id;

  try {
    const specificOrder = await ShopkeeperOrder.findById(orderId)
      .populate({
        path: 'orderItems.product',
        model: 'Products',
        select: 'title imageUrl', // Specify the fields you want to select
      });

    if (!specificOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderDetails = {
      _id: specificOrder._id,
      shop: specificOrder.shop,
      Date: specificOrder.Date,
      status: specificOrder.status,
      orderItems: specificOrder.orderItems.map((item) => ({
        product: {
          title: item.product.title,
          imageUrl: item.product.imageUrl,
        },
        quantity: item.quantity,
        total: item.total,
      })),
    };

    res.json(orderDetails);
  } catch (error) {
    console.error('Error fetching specific order:', error);
    res.status(500).json({ message: 'Error fetching specific order' });
  }
});


// Update order status and adjust product quantities
router.put('/distributor/orders/:id', authenticate, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Validate if the required fields are present
    if (!orderId || !status) {
      return res.status(400).json({ error: 'Invalid request. Please provide orderId and status.' });
    }

    const order = await ShopkeeperOrder.findById(orderId).populate({
      path: 'orderItems.product',
      model: 'Products', // Adjust the model name as needed
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    order.status = status;
    await order.save();

    // If the order is accepted, adjust product quantities in the distributor's inventory
    if (status === 'accepted') {
      for (const item of order.orderItems) {
        const product = item.product;
        const existingSell = await Sell.findOne({ product: product._id, status: 'accepted' });

        if (existingSell && existingSell.quantity >= item.quantity) {
          // Subtract ordered quantity from Sell model
          existingSell.quantity -= item.quantity;
          await existingSell.save();
        } else {
          return res.status(400).json({ error: 'Insufficient stock for one or more products' });
        }
      }
    }

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});


router.get('/shopkeeper/buyed-products', async (req, res) => {
  try {
    const acceptedOrders = await ShopkeeperOrder.find({ status: 'accepted' })
      .populate({
        path: 'orderItems.product',
        model: 'Products', // Adjust the model name as needed
        select: 'title imageUrl', // Specify the fields you want to select
      });

    const buyedProducts = [];

    acceptedOrders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const product = item.product;
        buyedProducts.push({
          orderId: order._id,
          title: product.title,
          imageUrl: product.imageUrl,
          quantity: item.quantity,
          total: item.total,
          date: order.date,
        });
      });
    });

    res.json(buyedProducts);
  } catch (error) {
    console.error('Error fetching buyed products:', error);
    res.status(500).json({ message: 'Error fetching buyed products' });
  }
});





module.exports = router;
