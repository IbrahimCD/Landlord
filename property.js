const API_BASE_URL = 'http://localhost:3000/api/properties';

// Toggle Add Property Form
const toggleAddPropertyForm = () => {
    const addPropertySection = document.getElementById('addPropertySection');
    const form = document.getElementById('addPropertyForm');

    // Use computed style to check visibility
    if (window.getComputedStyle(addPropertySection).display === 'none') {
        addPropertySection.style.display = 'block';
    } else {
        addPropertySection.style.display = 'none';
        form.reset(); // Reset form when hiding
    }
};
document.getElementById('toggleAddPropertyButton').addEventListener('click', toggleAddPropertyForm);

// Add Property
document.getElementById('addPropertyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const propertyData = {
        name: document.getElementById('name').value.trim(),
        address: document.getElementById('address').value.trim(),
        size: parseFloat(document.getElementById('size').value),
        type: document.getElementById('type').value,
        valuation: parseFloat(document.getElementById('valuation').value),
        caretaker: document.getElementById('caretaker').value.trim(),
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        agreementDetails: document.getElementById('agreementDetails').value.trim(),
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(propertyData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add property.');
        }

        alert('Property added successfully!');
        loadProperties();
        e.target.reset();
        toggleAddPropertyForm(); // Close the form after submission
    } catch (error) {
        console.error('Error adding property:', error.message);
        alert(error.message || 'Failed to add property.');
    }
});

// Open Edit Form
const openEditForm = (property) => {
    const editForm = document.getElementById('editPropertySection');
    editForm.style.display = 'block';
    document.getElementById('editPropertyId').value = property._id;
    document.getElementById('editName').value = property.name;
    document.getElementById('editAddress').value = property.address;
    document.getElementById('editSize').value = property.size;
    document.getElementById('editType').value = property.type;
    document.getElementById('editValuation').value = property.valuation;
    document.getElementById('editCaretaker').value = property.caretaker || '';
    document.getElementById('editPhoneNumber').value = property.phoneNumber || '';
    document.getElementById('editAgreementDetails').value = property.agreementDetails || '';
};

// Update Property
document.getElementById('editPropertyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const propertyId = document.getElementById('editPropertyId').value;
    const updatedPropertyData = {
        name: document.getElementById('editName').value.trim(),
        address: document.getElementById('editAddress').value.trim(),
        size: parseFloat(document.getElementById('editSize').value),
        type: document.getElementById('editType').value,
        valuation: parseFloat(document.getElementById('editValuation').value),
        caretaker: document.getElementById('editCaretaker').value.trim(),
        phoneNumber: document.getElementById('editPhoneNumber').value.trim(),
        agreementDetails: document.getElementById('editAgreementDetails').value.trim(),
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${propertyId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPropertyData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update property.');
        }

        alert('Property updated successfully!');
        loadProperties();
        document.getElementById('editPropertySection').style.display = 'none';
    } catch (error) {
        console.error('Error updating property:', error.message);
        alert(error.message || 'Failed to update property.');
    }
});

// Delete Property
document.getElementById('deletePropertyButton').addEventListener('click', async () => {
    const propertyId = document.getElementById('editPropertyId').value;

    if (!confirm('Are you sure you want to delete this property?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${propertyId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete property.');
        }

        alert('Property deleted successfully!');
        loadProperties();
        document.getElementById('editPropertySection').style.display = 'none';
    } catch (error) {
        console.error('Error deleting property:', error.message);
        alert(error.message || 'Failed to delete property.');
    }
});

// Search Properties
document.getElementById('searchButton').addEventListener('click', async () => {
    const searchQuery = document.getElementById('searchInput').value.trim();

    if (!searchQuery) {
        alert('Please enter a property name to search!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/search?name=${encodeURIComponent(searchQuery)}`);

        if (!response.ok) {
            throw new Error('Failed to search properties.');
        }

        const properties = await response.json();
        displayProperties(properties);
    } catch (error) {
        console.error('Error searching properties:', error.message);
        alert(error.message || 'Failed to search properties.');
    }
});

// Load and Display Properties
const loadProperties = async () => {
    const propertyList = document.getElementById('propertyList');
    propertyList.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error('Failed to load properties.');
        }

        const properties = await response.json();
        displayProperties(properties);
    } catch (error) {
        console.error('Error loading properties:', error.message);
        propertyList.innerHTML = '<p>Failed to load properties.</p>';
    }
};

// Display Properties in the List
const displayProperties = (properties) => {
    const propertyList = document.getElementById('propertyList');
    propertyList.innerHTML = '';

    if (!properties || properties.length === 0) {
        propertyList.innerHTML = '<p>No properties found.</p>';
        return;
    }

    properties.forEach((property) => {
        const propertyDiv = document.createElement('div');
        propertyDiv.classList.add('property-card');
        propertyDiv.innerHTML = `
            <h3>${property.name}</h3>
            <p><strong>Address:</strong> ${property.address}</p>
            <p><strong>Size:</strong> ${property.size} sq ft</p>
            <p><strong>Type:</strong> ${property.type}</p>
            <p><strong>Valuation:</strong> $${property.valuation.toLocaleString()}</p>
            <p><strong>Caretaker:</strong> ${property.caretaker || 'N/A'}</p>
            <p><strong>Phone Number:</strong> ${property.phoneNumber || 'N/A'}</p>
            <p><strong>Agreement Details:</strong> ${property.agreementDetails || 'N/A'}</p>
            <button class="edit-button" onclick='openEditForm(${JSON.stringify(property)})'>Edit</button>
        `;
        propertyList.appendChild(propertyDiv);
    });
};

// Initial Load
loadProperties();
