import React from 'react'

const home = () => {
  return (
    <div className="container flex flex-col items-center justify-center shadow-lg rounded-lg p-12 text-purple-400 shadow-purple-900/50 mt-8">
     <h1 className='items-center text-amber-50 text-4xl font-bold'>WEBSITE BUNKKER</h1>
     <div className='flex flex-col items-center justify-center p-4 m-2'>
     <p className='text-center text-purple-300 text-xl mb-2'>To get to the the page either be invited or break the website</p>
     <p className='text-center text-purple-300 text-md'>but there's also a easy way , what? <span className='relative cursor-pointer text-pink-400 hover:text-pink-200' title='Login with your credentials!'>Hint</span></p>
     </div>
    </div>
  )
}

export default home 