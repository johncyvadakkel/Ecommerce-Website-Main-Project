import React, { useState } from 'react';
import axios from 'axios';

function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
      });
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [submitStatus, setSubmitStatus] = useState(null);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
    
        try {
          const response = await axios.post('http://localhost:8080/api/admin/contact', formData);
          setFormData({ name: '', email: '', message: '' });
          setSubmitStatus({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.'
          });
        } catch (error) {
          setSubmitStatus({
            success: false,
            message: 'There was an error sending your message. Please try again later.'
          });
          console.error('Error submitting form:', error);
        } finally {
          setIsSubmitting(false);
        }
      };
    
      return (
        <form
          className="space-y-4 bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
          
          {submitStatus && (
            <div
              className={`p-3 rounded-lg ${
                submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-2 border rounded-lg"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full p-2 border rounded-lg"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            className="w-full p-2 border rounded-lg"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button
            type="submit"
            className={`w-full ${
              isSubmitting ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
            } text-white py-2 rounded-lg transition duration-200`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      );
}

export default ContactForm
