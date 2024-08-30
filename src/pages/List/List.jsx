import React, { useEffect ,useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({url}) => {
  
  const [list, setList] = useState([])

  
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
     

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Error fetching list');
      }
    } catch (error) {
      toast.error('Error fetching list');
      console.error('Error fetching list:', error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);


  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {id:foodId});
    await fetchList();
    if(response.data.success) {
      toast.success(response.data.message);
    }else {
      toast.error("Cant be Remove");
    }
  }

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((listItem, index) =>{
          return (
            <div className="list-table-format" key={index}>
              <img src={`${url}/images/`+listItem.image} alt="" />
              <p>{listItem.name}</p>
              <p>{listItem.category}</p>
              <p>{listItem.price}</p>
              <p className='cursor' onClick={() => removeFood(listItem._id)}>X</p>
            </div>
          )
        })}
      </div>
     
    </div>
  )
}

export default List
