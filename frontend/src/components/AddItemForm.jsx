import React, { useState } from 'react';
import '../App.css';

const initialForm = {
  name: '',
  type: '',
  sku: '',
  quantity: '',
  price: '',
  description: '',
  image_url: ''
};

export default function AddItemForm({ onAdd, loading }) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!form.name || !form.type || !form.sku || !form.quantity || !form.price) {
      setMessage('Please fill all required fields.');
      return;
    }
    try {
      await onAdd({
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price)
      });
      setMessage('Product added successfully!');
      setForm(initialForm);
    } catch (err) {
      setMessage('Failed to add product.');
    }
  };

  return (
    <div className="add-item-form-container">
      <form className="add-item-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">Item Name *</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Enter item name" />
          </div>
          <div className="form-field">
            <label htmlFor="type">Type *</label>
            <input id="type" name="type" value={form.type} onChange={handleChange} required placeholder="e.g., Electronics" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="sku">SKU *</label>
            <input id="sku" name="sku" value={form.sku} onChange={handleChange} required placeholder="Enter unique SKU code" />
          </div>
          <div className="form-field">
            <label htmlFor="quantity">Quantity *</label>
            <input id="quantity" name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} required placeholder="Enter quantity" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="price">Price ($) *</label>
            <input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required placeholder="Enter price" />
          </div>
          <div className="form-field">
            <label htmlFor="image_url">Item Image</label>
            <input id="image_url" name="image_url" value={form.image_url} onChange={handleChange} placeholder="Enter image URL (optional)" />
          </div>
        </div>
        <div className="form-field full-width">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} maxLength={500} rows={4} placeholder="Enter item description (optional)" />
        </div>
        <div className="form-actions">
          <button className="submit-btn" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Item'}</button>
        </div>
        {message && <div className={`form-message${message.includes('success') ? ' success' : ' error'}`}>{message}</div>}
      </form>
    </div>
  );
}
