import React,{ useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

const App=() =>{
   const [users,setUsers] = useState([]);
   const [selectedUser,setSelectedUser] = useState(null);
   const [formData,setFormData] = useState({
    id:'',
    firstname:'',
    lastname:'',
    email:'',
    department:'',
   })
    
   const [isEditing,setIsEditing] = useState(false)

   const API_URL ="https://jsonplaceholder.typicode.com/users"

   useEffect(()=>{
    axios
    .get(API_URL)
    .then((response)=>setUsers(response.data))
    .catch((err)=>console.log('Error fetching users:', err));
   },[]);

   const handleInputChange = (e) =>{
    setFormData({...formData,[e.target.name]:e.target.value});
   }
   

   const handleAddUser = (e)=>{
    e.preventDefault();
    axios
    .post(API_URL,formData)
    .then((response)=>{
        alert('User Add Sucessfully!');
        setUsers([...users,response.data]);
        setFormData({id:'',firstname:'',lastname:'',email:'',department:''})
    })
    .catch((err)=>console.log(`Error adding User:`,err));
   }

   const handleEditUser = (user) =>{
    setIsEditing(true);
    selectedUser(user);
    setFormData({
        id:user.id,
        firstname:user.firstname || user.name.split(" ")[0],
        lastname:user.lastname || user.name.split(" ")[1],
        email:user.email,
        department:user.department || "N/A",
    });
   };

   const handleUpdateUser = (e) =>{
    e.preventDefault();
    axios
      .put(`${API_URL}/${formData.id}`,formData)
      .then(()=>{
        alert("User Updated sucessfully");
        setUsers(
            users.map((user)=>
            user.id===formData.id
            ? {...user,...formData, name:`${formData.firstname} ${formData.lastname}`} : user
        ) );
        setIsEditing(false);
        setFormData({id:"",firstname:"",lastname:"",email:"",department:""});
      })
      .catch((err)=>console.log(`Error updating user:`,err))
   };

   const handleDeleteUser = (id) =>{
     axios.delete(`${API_URL}/${id}`)
     .then(()=>{
        alert("User deleted sucessfully!");
        setUsers(users.filter((user)=>user.id!==id))
     })
     .catch((err)=>console.log(`Error deleting user:`,err));
   }

   return(
    <div className='container'>
        <h1>User Management</h1>
        <form  onSubmit={isEditing ? handleUpdateUser : handleAddUser}>
            <input type='text'
              name='firstname'
              placeholder='First Name'
              onChange={handleInputChange}
              value={formData.firstname}
              required
              />
              <input type='text'
              name='lastname'
              placeholder='Last Name'
              onChange={handleInputChange}
              value={formData.lastname}
              required
              />
              <input type='email'
              name='email'
              placeholder='Email Id'
              onChange={handleInputChange}
              value={formData.email}
              required
              />
              <input type='text'
              name='department'
              placeholder='Department'
              onChange={handleInputChange}
              value={formData.department}
              />
              <div className='but'>
              <button
               type='submit'>{isEditing? 'Update User' :'Add User'}</button>
               </div>
        </form>
        <div className='table-container'>
           <h2>User List</h2>
   
            <table>
               <thead>
             <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Action</th>
             </tr>
             </thead>
             <tbody>
               {users.map((user)=>(
             <tr>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.department || "N/A"}</td>
             <td><button className='edit' onClick={()=>handleEditUser(user)}>Edit</button>
             <button className='delete' onClick={()=>handleDeleteUser(user.id)}>Delete</button></td>
             </tr>
               ))}
           </tbody>
           </table>
        </div>
    </div>
   );
};

export default App
