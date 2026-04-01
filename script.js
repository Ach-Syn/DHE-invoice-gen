// ===== Invoice Generator Script =====

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('tableBody');
    const addRowBtn = document.getElementById('addRowBtn');
    const subtotalValue = document.getElementById('subtotalValue');
    const taxInput = document.getElementById('taxInput');
    const totalValue = document.getElementById('totalValue');
    const invoiceNumber = document.getElementById('invoiceNumber');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const printBtn = document.getElementById('printBtn');
    const invoiceDate = document.getElementById('invoiceDate');

  // Set today's date as default
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    invoiceDate.value = `${yyyy}-${mm}-${dd}`;

  // Generate random 7-digit invoice number
    function generateInvoiceNumber() {
    const num = Math.floor(1000000 + Math.random() * 9000000);
    return String(num);
    }

  // Set initial invoice number
    invoiceNumber.textContent = generateInvoiceNumber();

  // Regenerate invoice number on button click
    regenerateBtn.addEventListener('click', () => {
    invoiceNumber.textContent = generateInvoiceNumber();
    });

  // Create a product row
    function createRow() {
    const row = document.createElement('div');
    row.className = 'table-row';

    row.innerHTML = `
        <span class="row-sn"></span>
        <input type="text" class="item-input" placeholder="Item name / Description" />
        <input type="number" class="price-input" placeholder="₦0" min="0" step="0.01" />
        <input type="number" class="qty-input" placeholder="0" min="0" step="1" value="1" />
        <span class="row-total">₦0</span>
        <button class="remove-row-btn" title="Remove row">&times;</button>
    `;

    // Price & quantity change handlers
    const priceInput = row.querySelector('.price-input');
    const qtyInput = row.querySelector('.qty-input');
    const rowTotal = row.querySelector('.row-total');
    const removeBtn = row.querySelector('.remove-row-btn');

    function updateRowTotal() {
        const price = parseFloat(priceInput.value) || 0;
        const qty = parseInt(qtyInput.value) || 0;
      const total = price * qty;
        rowTotal.textContent = `$${formatNumber(total)}`;
        updateTotals();
    }

    priceInput.addEventListener('input', updateRowTotal);
    qtyInput.addEventListener('input', updateRowTotal);

    removeBtn.addEventListener('click', () => {
        row.remove();
        updateSerialNumbers();
        updateTotals();
      // Ensure at least one row exists
        if (tableBody.children.length === 0) {
        addRow();
    }
    });

    tableBody.appendChild(row);
    updateSerialNumbers();
    return row;
}

  // Update serial numbers for all rows
    function updateSerialNumbers() {
    const rows = tableBody.querySelectorAll('.table-row');
    rows.forEach((row, index) => {
        row.querySelector('.row-sn').textContent = index + 1;
    });
    }

  // Add a new row
    function addRow() {
    const row = createRow();
    row.querySelector('.item-input').focus();
}

  // Update subtotal and total
    function updateTotals() {
    let subtotal = 0;
    const rows = tableBody.querySelectorAll('.table-row');

    rows.forEach(row => {
        const price = parseFloat(row.querySelector('.price-input').value) || 0;
        const qty = parseInt(row.querySelector('.qty-input').value) || 0;
      subtotal += price * qty;
    });

    const tax = parseFloat(taxInput.value) || 0;
    const total = subtotal + tax;

    subtotalValue.textContent = `$${formatNumber(subtotal)}`;
    totalValue.textContent = `$${formatNumber(total)}`;
}

  // Format number with commas
    function formatNumber(num) {
    if (num === 0) return '0';
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

  // Tax input change
taxInput.addEventListener('input', updateTotals);

  // Add row button
addRowBtn.addEventListener('click', addRow);

  // Print button
printBtn.addEventListener('click', () => {
    window.print();
});

  // Initialize with 7 default rows (matching the image)
for (let i = 0; i < 7; i++) {
    createRow();
}

  // Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+P to print
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        window.print();
    }
});
});
