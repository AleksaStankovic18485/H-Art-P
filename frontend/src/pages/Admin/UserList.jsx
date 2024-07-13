import React, {useState, useEffect} from 'react'
import { toast } from 'react-toastify'
import {
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation
} from '../../redux/api/usersApiSlice'
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import './UserList.css'

const UserList = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery()
    const [deleteUser] = useDeleteUserMutation()
    const [updateUser] = useUpdateUserMutation()



    const [editableUserId, setEditableUserId] = useState(null)
    const [editableUserName, setEditableUserName] = useState('')
    const [editableUserEmail, setEditableUserEmail] = useState('')

    useEffect(() => {
        window.scrollTo(0, 1); 
      }, []);

    useEffect(() => {
        refetch();
    }, [refetch])

    

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure")) {
          try {
            await deleteUser(id);
            refetch();
            toast.success('User deleted');
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
        }
      };
    
      const toggleEdit = (id, userName, email) => {
        setEditableUserId(id);
        setEditableUserName(userName);
        setEditableUserEmail(email);
      };
    
      const updateHandler = async (id) => {
        try {
          await updateUser({
            userId: id,
            userName: editableUserName,
            email: editableUserEmail,
          });
          setEditableUserId(null);
          refetch();
          toast.success('User updated');
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      };


    return (
        <div className="userlist">
            <h1 className="userlist-heading">User List</h1>
            {isLoading ? (<h2>Loading...</h2>) : error ? (<h1>{error?.data?.message || error.error}</h1>)
                :
                (
                    <div className="userlist-table-container">
                        <table className='userlist-table'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>USERNAME</th>
                                    <th>EMAIL</th>
                                    <th>ARTIST</th>
                                    <th>ADMIN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>
                                            {editableUserId === user._id ? (
                                                <div className="userlist-input-container">
                                                    <input type="text" value={editableUserName} onChange={e => setEditableUserName(e.target.value)} />
                                                    <button
                                                        onClick={() => updateHandler(user._id)}
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="userlist-input-container">
                                                    {user.userName}{" "}
                                                    <button
                                                        onClick={() =>
                                                            toggleEdit(user._id, user.userName, user.email)
                                                        }
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {editableUserId === user._id ? (
                                                <div className="userlist-input-container">
                                                    <input
                                                        type="email"
                                                        value={editableUserEmail}
                                                        onChange={(e) => setEditableUserEmail(e.target.value)}

                                                    />
                                                    <button
                                                        onClick={() => updateHandler(user._id)}
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="userlist-input-container">
                                                    <a href={`mailto:${user.email}`}>{user.email}</a>{" "}
                                                    <button
                                                        onClick={() =>
                                                            toggleEdit(user._id, user.userName, user.email)
                                                        }
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="userlist-checks">
                                            {user.isArtist ? (
                                                <FaCheck style={{ color: "green", fontSize: '20px', marginLeft: '1rem'}} />
                                            ) : (
                                                <FaTimes style={{ color: "red", fontSize: '20px', marginLeft: '1rem' }} />
                                            )}
                                        </td>
                                        <td className="userlist-checks">
                                            {user.isAdmin ? (
                                                <FaCheck style={{ color: "green", fontSize: '20px', marginLeft: '1rem'}} />
                                            ) : (
                                                <FaTimes style={{ color: "red", fontSize: '20px', marginLeft: '1rem' }} />
                                            )}
                                        </td>
                                        <td className="userlist-delete">
                                            {!user.isAdmin && (
                                                <div style={{ display: 'flex' }}>
                                                    <button
                                                        onClick={() => deleteHandler(user._id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
              ))}
                            </tbody>
                        </table>
                    </div>
                )}
        </div>
    );
};

export default UserList;