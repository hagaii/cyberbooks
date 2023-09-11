import React from 'react';
import { useForm } from "react-hook-form";
import {Book} from './Types'
import './PurchaseForm.css';

interface Props {
  books: Book[]
  onClose: () => void;
  onPurchase: (formData: any) => void;
  isOpen: boolean;
}

const PurchaseForm: React.FC<Props> = ({ books=[], onClose, onPurchase, isOpen }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const fields = [
        {
            key: "name", 
            label: "Name", 
            options: { required: "Name is required", minLength: {value: 4, message: "Name too short" } }
        },
        {
            key: "phoneNumber", 
            label: "Phone number", 
            options: {required: "Number is required", minLength: {value: 10, message: "Number too short" } }
        },
        {
            key: "email", label: "Email", options: { 
                required: "Email is required", 
                minLength: {value: 4, message: "Email too short",  },
                pattern: { value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, message: 'Email must be a valid address'}
            }
        },
        {
            key: "address", 
            label: "Address", 
            options: { required: "Address is required", minLength: {value: 15, message: "Address too short" } }
        },
    ]
    return (
        <div className={`purchase-form-overlay${isOpen ? ' open' : ''}`}>
          <div className="purchase-form">
            <button className="close-button" onClick={onClose}>
              X
            </button>
            <h2>Make a Purchase</h2>
            <div className="form-group">{books.map((book)=>
                <li key={book.id}>{book.volumeInfo.title}</li>
                )}
            </div>
            <form onSubmit={handleSubmit(onPurchase)}>
                {fields.map(({key, label, options}) => <div key={key} className="form-group">
                    <label>{label}:</label>
                    <input {...register(key, options) } />
                    {errors[key] && <span className='error'>{errors[key]?.message?.toString()}</span> }
                </div>)}
                <button type="submit">Submit</button>
            </form>
          </div>
        </div>
        )
}

export default PurchaseForm;
