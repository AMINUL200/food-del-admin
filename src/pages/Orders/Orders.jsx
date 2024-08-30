import React from 'react'
import './Orders.css'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import axios from 'axios'
import { assets } from '../../assets/assets'

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  // fetch orders from backend here:
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        const sortedOrders = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date in descending order
        setOrders(sortedOrders);
        console.log(sortedOrders);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error("Error fetching orders:", error);
    }
  };
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", { orderId, status: event.target.value });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Status updated successfully");
      } else {
        toast.error("Error updating status");
      }
    } catch (error) {
      toast.error("Error updating status");
      console.error("Error updating status:", error);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [url])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <div>
                <p className='order-item-food'>
                  {order.items.map((item, index) => {
                    const times = order.times || [];
                    if (index === times.length - 1) {
                      return item.name + " X" + item.quantity;
                    } else {
                      return item.name + " X" + item.quantity + ",";
                    }
                  })}
                </p>
                <p className='order-item-name'>
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p className='order-item-phone'>{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>${order.amount}</p>
              <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="On the Way">On the Way</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          ))
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  )
}

export default Orders
