import  { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import background from '../../assets/Background.png'

const AuthLayout = () => {
  return (
    <div className='relative  '>
        <img src={background} alt="" className='w-screen h-screen object-fill' />
        <Suspense fallback={<div>Loading...</div>}>
        <Outlet/>
        </Suspense>
    </div>
  )
}

export default AuthLayout