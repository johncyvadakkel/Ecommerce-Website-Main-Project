import React from 'react';
import AddressManagement from './AddressManagement';
import { useAuth } from '../AuthContext';

function AccountAddressesPage() {
    const { currentUserId } = useAuth();
    console.log('currentUserId:', currentUserId);


    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">My Addresses</h1>
        <AddressManagement userId={currentUserId} />
      </div>
    );
}

export default AccountAddressesPage
