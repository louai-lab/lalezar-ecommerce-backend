// orderController.js
import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
import moment from "moment";

export const getRevenue = async (req, res) => {
  const { option } = req.body;
  const today = moment();
  try {
    if (option === "monthly") {
      const lastMonthStartDate = moment(today).subtract(30, "days");
      const lastMonthEndDate = moment(today).date(today.date());

      const orders = await Order.find({
        createdAt: {
          $gte: lastMonthStartDate.toDate(),
          $lte: lastMonthEndDate.toDate(),
        },
      });

      const dailyRevenueData = generateDailyRevenueData(
        orders,
        lastMonthStartDate
      );

      res.status(200).json(dailyRevenueData);
    } else if (option === "weekly") {
      const lastWeekStartDate = moment(today).subtract(7, "days");
      const lastWeekEndDate = moment(today).date(today.date());

      const orders = await Order.find({
        createdAt: {
          $gte: lastWeekStartDate.toDate(),
          $lte: lastWeekEndDate.toDate(),
        },
      });

      const weeklyRevenueData = generateDailyRevenueData(
        orders,
        lastWeekStartDate
      );

      res.status(200).json(weeklyRevenueData);
    } else if (option === "daily") {
      const currentDayStartDate = moment(today).startOf("day");
      const currentDayEndDate = moment(today).endOf("day");

      const orders = await Order.find({
        createdAt: {
          $gte: currentDayStartDate.toDate(),
          $lte: currentDayEndDate.toDate(),
        },
      });

      const hourlyRevenueData = generateHourlyRevenueData(
        orders,
        currentDayStartDate
      );

      res.status(200).json(hourlyRevenueData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTopProducts = async (req, res) => {
  const { option } = req.body;
  const today = moment();
  try {
    if (option === "sold") {
      // Calculate the start date for the last month
      const lastMonthStart = moment(today).subtract(30, "days");

      // Find orders within the last month
      const orders = await Order.find({
        createdAt: { $gte: lastMonthStart },
      }).populate("orderDetails");

      // Calculate total quantity sold for each product
      const productQuantities = new Map();

      orders.forEach((order) => {
        order.orderDetails.forEach((orderDetail) => {
          const productId = orderDetail._id.toString();

          if (!productQuantities.has(productId)) {
            productQuantities.set(productId, 0);
          }

          productQuantities.set(
            productId,
            productQuantities.get(productId) + orderDetail.quantity
          );
        });
      });

      // Sort products based on total quantity sold
      const sortedProducts = [...productQuantities.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7);

      // Retrieve product details using the product IDs
      const topProducts = await Promise.all(
        sortedProducts.map(async ([productId, quantity]) => {
          // Assuming there's a Product model for your products
          const productDetails = await Product.findById(productId);

          return {
            productDetails,
            totalQuantitySold: quantity,
          };
        })
      );

      const xaxis =
        topProducts && topProducts.map((item) => item.productDetails.name);
      const yaxis =
        topProducts && topProducts.map((item) => item.totalQuantitySold);

      res.status(200).json({
        xaxis,
        yaxis,
      });
    } else if (option === "seller") {
      const lastMonthStart = moment(today).subtract(30, "days");

      // Find orders within the last month
      const orders = await Order.find({
        createdAt: { $gte: lastMonthStart },
      }).populate("orderDetails");

      // Calculate total revenue for each product
      const productRevenues = new Map();

      orders.forEach((order) => {
        order.orderDetails.forEach((orderDetail) => {
          const productId = orderDetail._id.toString();

          if (!productRevenues.has(productId)) {
            productRevenues.set(productId, 0);
          }

          const productPrice = orderDetail.price;
          productRevenues.set(
            productId,
            productRevenues.get(productId) + productPrice * orderDetail.quantity
          );
        });
      });

      // Sort products based on total revenue
      const sortedProducts = [...productRevenues.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7);

      // Retrieve product details using the product IDs
      const topProducts = await Promise.all(
        sortedProducts.map(async ([productId, revenue]) => {
          // Assuming there's a Product model for your products
          const productDetails = await Product.findById(productId);

          return {
            productDetails,
            totalRevenue: revenue,
          };
        })
      );

      const xaxis =
        topProducts && topProducts.map((item) => item.productDetails.name);
      const yaxis =
        topProducts && topProducts.map((item) => parseInt(item.totalRevenue));

      res.status(200).json({
        xaxis,
        yaxis,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

export const getMostCommonCountries = async (req, res) => {
  const { option } = req.body;
  try {
    if (option === "country") {
      const orders = await Order.find(); // Fetch all orders
      const countryCounts = {};

      // Count orders for each country
      orders.forEach((order) => {
        const country = order.country;
        if (countryCounts[country]) {
          countryCounts[country]++;
        } else {
          countryCounts[country] = 1;
        }
      });

      // Sort countries by order count in descending order
      const sortedCountries = Object.entries(countryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Take the top 5 countries

      const topCountries = sortedCountries.map(([country, count]) => ({
        country,
        orderCount: count,
      }));

      const xaxis = topCountries && topCountries.map((item) => item.country);
      const yaxis = topCountries && topCountries.map((item) => item.orderCount);

      return res.json({
        xaxis,
        yaxis,
      });
    } else if (option === "city") {
      const orders = await Order.find(); // Fetch all orders
      const cityCounts = {};

      // Count orders for each country
      orders.forEach((order) => {
        const city = order.city;
        if (cityCounts[city]) {
          cityCounts[city]++;
        } else {
          cityCounts[city] = 1;
        }
      });

      // Sort cities by order count in descending order
      const sortedCities = Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Take the top 5 cities

      const topCities = sortedCities.map(([city, count]) => ({
        city,
        orderCount: count,
      }));

      const xaxis = topCities && topCities.map((item) => item.city);
      const yaxis = topCities && topCities.map((item) => item.orderCount);

      return res.json({
        xaxis,
        yaxis,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDashboardInfo = async (req, res) => {
  try {
    // Fetch all orders, products, and users
    const orders = await Order.find();
    const products = await Product.find();
    const users = await User.find();

    // Calculate total revenue
    const totalRevenue = orders.reduce((acc, order) => {
      return acc + order.totalPrice;
    }, 0);

    // Get lengths of products, users, and orders
    const productsLength = products.length;
    const usersLength = users.length;
    const ordersLength = orders.length;

    return res.status(200).json([
      { title: "Total Revenue", number: totalRevenue, icon: "<PaidIcon/>" },
      {
        title: "Total Products",
        number: productsLength,
        icon: "<LocalMallIcon/>",
      },
      {
        title: "Total Orders",
        number: ordersLength,
        icon: "<ShoppingCartIcon/>",
      },
      { title: "Total Users", number: usersLength, icon: "<GroupIcon/>" },
    ]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get the percentage of products in each category
export const getCategoryPercentage = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find();

    // Fetch total number of products
    const totalProducts = await Product.countDocuments();

    // Fetch product count for each category
    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
        });
        return {
          category: category.name,
          percentage: (productCount / totalProducts) * 100,
        };
      })
    );
    const category =
      categoryCounts && categoryCounts.map((item) => item.category);
    const percentage =
      categoryCounts && categoryCounts.map((item) => item.percentage);

    return res.status(200).json({
      category,
      percentage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTopUsersByOrders = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find();

    // Count orders for each user
    const userOrderCounts = {};
    orders.forEach((order) => {
      const userId = order.userId;
      if (userOrderCounts[userId]) {
        userOrderCounts[userId]++;
      } else {
        userOrderCounts[userId] = 1;
      }
    });

    // Sort users by order count in descending order
    const sortedUsers = Object.entries(userOrderCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Take the top 5 users

    // Get top 5 users with their order counts
    const topUsers = await Promise.all(
      sortedUsers.map(async ([userId, orderCount]) => {
        const user = await User.findById(userId);
        return {
          userId,
          username: user.firstName + " " + user.lastName, // Assuming the User model has a 'username' field
          orderCount,
        };
      })
    );

    const names = topUsers && topUsers.map((item) => item.username);
    const ordersCount = topUsers && topUsers.map((item) => item.orderCount);

    return res.json({
      names,
      ordersCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//////////////////////
//////////////////////
//////////////////////
//////////////////////
// helper functions //
//////////////////////
//////////////////////
//////////////////////
//////////////////////

const generateDailyRevenueData = (orders, startDate) => {
  const dailyRevenueData = [];
  const currentDate = moment(startDate);

  while (currentDate <= moment()) {
    const formattedDate = currentDate.format("MMM DD YYYY");
    const totalRevenue = calculateTotalRevenueForDay(orders, currentDate);

    dailyRevenueData.push({ x: formattedDate, y: totalRevenue });

    currentDate.add(1, "day");
  }

  return dailyRevenueData;
};

const calculateTotalRevenueForDay = (orders, date) => {
  const ordersForDay = orders.filter((order) => {
    const orderDate = moment(order.createdAt).startOf("day"); // consider only the date without time
    return orderDate.isSame(date.startOf("day"));
  });

  return ordersForDay.reduce((sum, order) => sum + order.totalPrice, 0);
};

const generateHourlyRevenueData = (orders, startDate) => {
  const hourlyRevenueData = [];
  const currentHour = moment().hour();

  for (let hour = 0; hour <= currentHour; hour++) {
    const currentHourStart = moment(startDate).add(hour, "hours");
    const currentHourEnd = moment(startDate).add(hour + 1, "hours");

    const totalRevenue = calculateTotalRevenueForHour(
      orders,
      currentHourStart,
      currentHourEnd
    );

    const formattedHour = currentHourStart.format("HH:mm");
    hourlyRevenueData.push({ x: formattedHour, y: totalRevenue });
  }

  return hourlyRevenueData;
};

const calculateTotalRevenueForHour = (orders, startHour, endHour) => {
  const ordersForHour = orders.filter((order) => {
    const orderDate = moment(order.createdAt);
    return orderDate.isBetween(startHour, endHour);
  });

  return ordersForHour.reduce((sum, order) => sum + order.totalPrice, 0);
};
