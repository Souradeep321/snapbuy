import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/userReducer'
import { toast } from 'react-hot-toast'

const Navbar = ({ user }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  console.log('user', user)

  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-2'>
        <h1 className='text-2xl font-bold'>Logo</h1>
      </div>

      <div className='flex items-center gap-2'>
        {user && user.role === "admin" ?
          <Button
            onClick={() => navigate("/admin")}
          >Admin
          </Button>
          : null}
      </div>


      <div className='flex items-center gap-2'>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            try {
              dispatch(logout())
              navigate("/login")
            } catch (error) {
              toast.error(error.message)
            }
          }}
        >Logout</Button>
      </div>
    </div >

  )
}

export default Navbar