import { useState } from 'react';

const ProductsTable = ({ products, onUpdateProduct, onAddProduct }) => {
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [errors, setErrors] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: '',
        category: '',
        unitPrice: '',
        cogs: '',
    });

    const handleEdit = (product) => {
        setEditingId(product.id);
        setEditForm({ ...product });
        setErrors({});
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
        setErrors({});
    };

    const validateProduct = (product) => {
        const newErrors = {};

        if (!product.title || product.title.trim() === '') {
            newErrors.title = 'Title is required';
        }

        if (!product.category || product.category.trim() === '') {
            newErrors.category = 'Category is required';
        }

        const price = parseFloat(product.unitPrice);
        if (isNaN(price) || price <= 0) {
            newErrors.unitPrice = 'Unit price must be a number greater than 0';
        }

        const cogsValue = parseFloat(product.cogs);
        if (isNaN(cogsValue) || cogsValue <= 0) {
            newErrors.cogs = 'COGS must be a number greater than 0';
        }

        return newErrors;
    };

    const handleSave = async () => {
        const validationErrors = validateProduct(editForm);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const updatedProduct = {
            ...editForm,
            unitPrice: parseFloat(editForm.unitPrice),
            cogs: parseFloat(editForm.cogs),
        };

        await onUpdateProduct(updatedProduct);
        setEditingId(null);
        setEditForm({});
        setErrors({});
    };

    const handleAddNew = () => {
        setIsAdding(true);
        setNewProduct({
            title: '',
            category: '',
            unitPrice: '',
            cogs: '',
        });
        setErrors({});
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewProduct({
            title: '',
            category: '',
            unitPrice: '',
            cogs: '',
        });
        setErrors({});
    };

    const handleSaveNew = async () => {
        const validationErrors = validateProduct(newProduct);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const productToAdd = {
            title: newProduct.title,
            category: newProduct.category,
            unitPrice: parseFloat(newProduct.unitPrice),
            cogs: parseFloat(newProduct.cogs),
        };

        await onAddProduct(productToAdd);
        setIsAdding(false);
        setNewProduct({
            title: '',
            category: '',
            unitPrice: '',
            cogs: '',
        });
        setErrors({});
    };

    const handleInputChange = (field, value, isNew = false) => {
        if (isNew) {
            setNewProduct({ ...newProduct, [field]: value });
        } else {
            setEditForm({ ...editForm, [field]: value });
        }
        // Clear error for this field
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    return (
        <div className="card animate-slide-up">
            <div className="card-header">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Products</h2>
                    <button
                        onClick={handleAddNew}
                        disabled={isAdding}
                        className="btn btn-primary"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Product
                        </span>
                    </button>
                </div>
            </div>
            <div className="card-body">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Unit Price ($)</th>
                                <th>COGS ($)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    {editingId === product.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editForm.title}
                                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                                    className={`input w-full ${errors.title ? 'input-error' : ''}`}
                                                />
                                                {errors.title && <div className="error-message">{errors.title}</div>}
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editForm.category}
                                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                                    className={`input w-full ${errors.category ? 'input-error' : ''}`}
                                                />
                                                {errors.category && <div className="error-message">{errors.category}</div>}
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editForm.unitPrice}
                                                    onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                                                    className={`input w-full ${errors.unitPrice ? 'input-error' : ''}`}
                                                />
                                                {errors.unitPrice && <div className="error-message">{errors.unitPrice}</div>}
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editForm.cogs}
                                                    onChange={(e) => handleInputChange('cogs', e.target.value)}
                                                    className={`input w-full ${errors.cogs ? 'input-error' : ''}`}
                                                />
                                                {errors.cogs && <div className="error-message">{errors.cogs}</div>}
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button onClick={handleSave} className="btn btn-success text-sm">
                                                        Save
                                                    </button>
                                                    <button onClick={handleCancel} className="btn btn-secondary text-sm">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="font-medium">{product.title}</td>
                                            <td>
                                                <span className="badge bg-primary-100 text-primary-800">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="font-semibold text-green-700">${product.unitPrice.toFixed(2)}</td>
                                            <td className="font-semibold text-orange-700">${product.cogs.toFixed(2)}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="btn btn-secondary text-sm"
                                                >
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </span>
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {isAdding && (
                                <tr className="bg-blue-50">
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Product title"
                                            value={newProduct.title}
                                            onChange={(e) => handleInputChange('title', e.target.value, true)}
                                            className={`input w-full ${errors.title ? 'input-error' : ''}`}
                                        />
                                        {errors.title && <div className="error-message">{errors.title}</div>}
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Category"
                                            value={newProduct.category}
                                            onChange={(e) => handleInputChange('category', e.target.value, true)}
                                            className={`input w-full ${errors.category ? 'input-error' : ''}`}
                                        />
                                        {errors.category && <div className="error-message">{errors.category}</div>}
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={newProduct.unitPrice}
                                            onChange={(e) => handleInputChange('unitPrice', e.target.value, true)}
                                            className={`input w-full ${errors.unitPrice ? 'input-error' : ''}`}
                                        />
                                        {errors.unitPrice && <div className="error-message">{errors.unitPrice}</div>}
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={newProduct.cogs}
                                            onChange={(e) => handleInputChange('cogs', e.target.value, true)}
                                            className={`input w-full ${errors.cogs ? 'input-error' : ''}`}
                                        />
                                        {errors.cogs && <div className="error-message">{errors.cogs}</div>}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button onClick={handleSaveNew} className="btn btn-success text-sm">
                                                Save
                                            </button>
                                            <button onClick={handleCancelAdd} className="btn btn-secondary text-sm">
                                                Cancel
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductsTable;
