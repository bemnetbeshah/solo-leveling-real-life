import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Plus, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high'])
});

export default function ToastExample() {
  const [items, setItems] = useState([]);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (data) => {
    const newItem = {
      id: Date.now(),
      ...data,
      completed: false
    };
    
    setItems([...items, newItem]);
    toast.success('Item added successfully!');
    reset();
  };

  const toggleComplete = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
    toast.success('Item updated!');
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    toast.error('Item deleted!');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Example Component</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-4">
        <div>
          <input
            {...register('title')}
            placeholder="Item title"
            className="w-full p-2 bg-gray-700 rounded text-white placeholder-gray-400"
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <textarea
            {...register('description')}
            placeholder="Item description"
            className="w-full p-2 bg-gray-700 rounded text-white placeholder-gray-400"
            rows="3"
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
        
        <div>
          <select
            {...register('priority')}
            className="w-full p-2 bg-gray-700 rounded text-white"
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && (
            <p className="text-red-400 text-sm mt-1">{errors.priority.message}</p>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Item
        </motion.button>
      </form>

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-3 rounded-lg flex items-center justify-between ${
              item.completed ? 'bg-gray-700' : 'bg-gray-600'
            }`}
          >
            <div className="flex-1">
              <h3 className={`font-semibold ${item.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                {item.title}
              </h3>
              <p className={`text-sm ${item.completed ? 'text-gray-500' : 'text-gray-300'}`}>
                {item.description}
              </p>
              <span className={`text-xs px-2 py-1 rounded ${
                item.priority === 'high' ? 'bg-red-500' :
                item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}>
                {item.priority}
              </span>
            </div>
            
            <div className="flex gap-2 ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleComplete(item.id)}
                className={`p-1 rounded ${
                  item.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                <Check size={16} className="text-white" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteItem(item.id)}
                className="p-1 rounded bg-red-600 hover:bg-red-700"
              >
                <X size={16} className="text-white" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 