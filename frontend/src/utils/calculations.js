/**
 * Utility functions for calculating order analytics
 * All business logic is isolated here for testability and reusability
 */

/**
 * Round a number to 1 decimal place
 * @param {number} value - The value to round
 * @returns {number} Rounded value
 */
export const roundToOneDecimal = (value) => {
    return Math.round(value * 10) / 10;
};

/**
 * Calculate Gross Sales for an order
 * Formula: Sum of (Product Unit Price × Quantity) for all line items
 * @param {Array} lineItems - Array of {productId, quantity}
 * @param {Array} products - Array of product objects
 * @returns {number} Gross sales amount
 */
export const calculateGrossSales = (lineItems, products) => {
    const total = lineItems.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return sum;
        return sum + (product.unitPrice * item.quantity);
    }, 0);
    return roundToOneDecimal(total);
};

/**
 * Calculate Total COGS for an order
 * Formula: Sum of (Product COGS × Quantity) for all line items
 * @param {Array} lineItems - Array of {productId, quantity}
 * @param {Array} products - Array of product objects
 * @returns {number} Total COGS amount
 */
export const calculateTotalCOGS = (lineItems, products) => {
    const total = lineItems.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return sum;
        return sum + (product.cogs * item.quantity);
    }, 0);
    return roundToOneDecimal(total);
};

/**
 * Calculate Sales for an order
 * Formula: Gross Sales + Taxes - Discounts + Shipping
 * @param {number} grossSales - Gross sales amount
 * @param {number} taxes - Tax amount
 * @param {number} discounts - Discount amount
 * @param {number} shipping - Shipping amount
 * @returns {number} Sales amount
 */
export const calculateSales = (grossSales, taxes, discounts, shipping) => {
    const sales = grossSales + taxes - discounts + shipping;
    return roundToOneDecimal(sales);
};

/**
 * Calculate Gross Profit for an order
 * Formula: Sales - Total COGS
 * @param {number} sales - Sales amount
 * @param {number} totalCOGS - Total COGS amount
 * @returns {number} Gross profit amount
 */
export const calculateGrossProfit = (sales, totalCOGS) => {
    const profit = sales - totalCOGS;
    return roundToOneDecimal(profit);
};

/**
 * Calculate Gross Margin for an order
 * Formula: (Gross Profit / Sales) × 100
 * @param {number} grossProfit - Gross profit amount
 * @param {number} sales - Sales amount
 * @returns {number} Gross margin as percentage
 */
export const calculateGrossMargin = (grossProfit, sales) => {
    if (sales === 0) return 0;
    const margin = (grossProfit / sales) * 100;
    return roundToOneDecimal(margin);
};

/**
 * Calculate all analytics for a single order
 * @param {Object} order - Order object with lineItems, discounts, taxes, shipping
 * @param {Array} products - Array of product objects
 * @returns {Object} Object containing all calculated values
 */
export const calculateOrderAnalytics = (order, products) => {
    const grossSales = calculateGrossSales(order.lineItems, products);
    const totalCOGS = calculateTotalCOGS(order.lineItems, products);
    const sales = calculateSales(grossSales, order.taxes, order.discounts, order.shipping);
    const grossProfit = calculateGrossProfit(sales, totalCOGS);
    const grossMargin = calculateGrossMargin(grossProfit, sales);

    return {
        orderNo: order.orderNo,
        grossSales,
        discounts: roundToOneDecimal(order.discounts),
        taxes: roundToOneDecimal(order.taxes),
        shipping: roundToOneDecimal(order.shipping),
        sales,
        totalCOGS,
        grossProfit,
        grossMargin,
    };
};
