'use client'

import React, { useState,useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useUser } from '@clerk/clerk-react'
import { db } from '../../_components/firebase'
import Modal from './_components/Modal'

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isMember,setMember]=useState()
  const {user,isLoaded}=useUser()

  const onPaymentSuccess = (details) => {
    alert(`Transaction completed by ${details.payer.name.given_name}`)
  }

  const onError = (err) => {
    console.error('PayPal Error:', err)
    alert('Something went wrong with the payment.')
  }

  const onCancel = () => {
    alert('Payment was cancelled.')
  }

   useEffect(() => {
        if (!isLoaded || !user) return
    
        const getData = async () => {
          try {
            const q = query(
              collection(db, 'User-info'),
              where('email', '==', user.emailAddresses[0].emailAddress)
            )
            
            const querySnapshot = await getDocs(q)
           const data = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }))
            setMember(data[0].isMembership)
           
          } catch (error) {
            console.error('Error fetching documents:', error)
          }
        }
    
        getData()
      }, [isLoaded, user])


  return (
      <div className="flex flex-col items-center justify-center p-6 ">
        <h1 className="text-3xl font-bold text-white mb-10">Our Pricing Plans</h1>

        <div className="flex flex-wrap gap-6 justify-center">
          {selectedPlan !== 'pro' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 w-72 text-center">
              <h2 className="text-xl font-semibold mb-2">Basic Plan</h2>
              <p className="text-lg mb-4">0/month</p>
              <ul className="text-gray-600 mb-4 space-y-1">
                <li>✔️ 5 Projects</li>
                <li>✔️ Basic Support</li>
                <li>✔️ Access to Templates</li>
              </ul>
              
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6 w-72 text-center">
            <h2 className="text-xl font-semibold mb-2">Pro Plan</h2>
            <p className="text-lg mb-4">30/month</p>
            <ul className="text-gray-600 mb-4 space-y-1">
              <li>✔️ Unlimited Projects</li>
              <li>✔️ Priority Support</li>
              <li>✔️ AI assistance</li>
            </ul>

            {isMember?<button className=" px-4 py-2 rounded-md w-full mb-3 bg-slate-400">Current Plan</button>:
            
            !selectedPlan && (
              <Button
                className="text-white px-4 py-2 rounded-md w-full mb-3"
                onClick={() => setSelectedPlan('pro')}
              >
                Choose Plan
              </Button>
            )
            }

            {selectedPlan === 'pro' && (
              <div className="justify-center mt-2">
                
                <Modal>

                  <Button className='bg-slate-800 text-white w-full hover:bg-black' >Card</Button>
                </Modal>
                
              </div>
              
            )}
            
          </div>
        </div>
      </div>
  )
}

export default Pricing
