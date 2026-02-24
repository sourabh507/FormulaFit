/**
 * Strategy Design Pattern - Complete Working Example
 * Run this file to see the pattern in action!
 */

// ============================================
// STRATEGY INTERFACE
// ============================================
interface PaymentStrategy {
    pay(amount: number): void;
    validate(): boolean;
}

// ============================================
// CONCRETE STRATEGIES
// ============================================

class CreditCardPayment implements PaymentStrategy {
    private cardNumber: string;
    private cvv: string;
    private cardHolderName: string;

    constructor(cardNumber: string, cvv: string, cardHolderName: string) {
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.cardHolderName = cardHolderName;
    }

    validate(): boolean {
        console.log("  🔍 Validating credit card...");
        const isValid = this.cardNumber.length === 16 && this.cvv.length === 3;
        console.log(`  ${isValid ? "✅" : "❌"} Validation ${isValid ? "successful" : "failed"}`);
        return isValid;
    }

    pay(amount: number): void {
        if (this.validate()) {
            console.log(`  💳 Processing credit card payment...`);
            console.log(`  💰 Paid $${amount} using Credit Card`);
            console.log(`  👤 Card Holder: ${this.cardHolderName}`);
            console.log(`  🔢 Card ending in: ****${this.cardNumber.slice(-4)}`);
        } else {
            console.log(`  ❌ Payment failed - Invalid card details`);
        }
    }
}

class PayPalPayment implements PaymentStrategy {
    private email: string;
    private password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    validate(): boolean {
        console.log("  🔍 Validating PayPal account...");
        const isValid = this.email.includes("@") && this.password.length >= 6;
        console.log(`  ${isValid ? "✅" : "❌"} Validation ${isValid ? "successful" : "failed"}`);
        return isValid;
    }

    pay(amount: number): void {
        if (this.validate()) {
            console.log(`  🅿️ Redirecting to PayPal...`);
            console.log(`  💰 Paid $${amount} using PayPal`);
            console.log(`  📧 Account: ${this.email}`);
        } else {
            console.log(`  ❌ Payment failed - Invalid PayPal credentials`);
        }
    }
}

class CryptoPayment implements PaymentStrategy {
    private walletAddress: string;
    private cryptoType: string;

    constructor(walletAddress: string, cryptoType: string = "Bitcoin") {
        this.walletAddress = walletAddress;
        this.cryptoType = cryptoType;
    }

    validate(): boolean {
        console.log("  🔍 Validating crypto wallet...");
        const isValid = this.walletAddress.length >= 26;
        console.log(`  ${isValid ? "✅" : "❌"} Validation ${isValid ? "successful" : "failed"}`);
        return isValid;
    }

    pay(amount: number): void {
        if (this.validate()) {
            console.log(`  ₿ Initiating blockchain transaction...`);
            console.log(`  💰 Paid $${amount} using ${this.cryptoType}`);
            console.log(`  🔐 Wallet: ${this.walletAddress.slice(0, 10)}...${this.walletAddress.slice(-6)}`);
            console.log(`  ⏳ Waiting for blockchain confirmation...`);
        } else {
            console.log(`  ❌ Payment failed - Invalid wallet address`);
        }
    }
}

class BankTransferPayment implements PaymentStrategy {
    private accountNumber: string;
    private routingNumber: string;
    private bankName: string;

    constructor(accountNumber: string, routingNumber: string, bankName: string) {
        this.accountNumber = accountNumber;
        this.routingNumber = routingNumber;
        this.bankName = bankName;
    }

    validate(): boolean {
        console.log("  🔍 Validating bank account...");
        const isValid = this.accountNumber.length >= 8 && this.routingNumber.length === 9;
        console.log(`  ${isValid ? "✅" : "❌"} Validation ${isValid ? "successful" : "failed"}`);
        return isValid;
    }

    pay(amount: number): void {
        if (this.validate()) {
            console.log(`  🏦 Initiating bank transfer...`);
            console.log(`  💰 Paid $${amount} via Bank Transfer`);
            console.log(`  🏛️ Bank: ${this.bankName}`);
            console.log(`  🔢 Account: ****${this.accountNumber.slice(-4)}`);
            console.log(`  ⏱️ Transfer will complete in 1-3 business days`);
        } else {
            console.log(`  ❌ Payment failed - Invalid bank details`);
        }
    }
}

// ============================================
// CONTEXT
// ============================================

class ShoppingCart {
    private paymentStrategy: PaymentStrategy | null = null;
    private items: Array<{ name: string; price: number }> = [];

    addItem(name: string, price: number): void {
        this.items.push({ name, price });
        console.log(`✅ Added "${name}" ($${price}) to cart`);
    }

    removeItem(name: string): void {
        const index = this.items.findIndex(item => item.name === name);
        if (index !== -1) {
            this.items.splice(index, 1);
            console.log(`🗑️ Removed "${name}" from cart`);
        }
    }

    setPaymentStrategy(strategy: PaymentStrategy): void {
        this.paymentStrategy = strategy;
        console.log(`💳 Payment method updated`);
    }

    getTotalAmount(): number {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    showCart(): void {
        console.log("\n🛒 Shopping Cart:");
        console.log("─".repeat(50));
        if (this.items.length === 0) {
            console.log("  (empty)");
        } else {
            this.items.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.name} - $${item.price}`);
            });
            console.log("─".repeat(50));
            console.log(`  💵 Total: $${this.getTotalAmount()}`);
        }
        console.log("─".repeat(50));
    }

    checkout(): void {
        console.log("\n" + "=".repeat(50));
        console.log("🛍️ CHECKOUT PROCESS");
        console.log("=".repeat(50));

        if (this.items.length === 0) {
            console.log("❌ Cart is empty! Add items before checkout.");
            return;
        }

        if (!this.paymentStrategy) {
            console.log("❌ Please select a payment method!");
            return;
        }

        const total = this.getTotalAmount();
        console.log(`📦 Processing ${this.items.length} item(s)...`);
        console.log(`💵 Total Amount: $${total}`);
        console.log("");

        this.paymentStrategy.pay(total);

        console.log("\n✨ Thank you for your purchase!");
        console.log("=".repeat(50));
    }
}

// ============================================
// DEMO / CLIENT CODE
// ============================================

function runDemo() {
    console.log("\n");
    console.log("╔════════════════════════════════════════════════╗");
    console.log("║   STRATEGY PATTERN DEMO - Payment System      ║");
    console.log("╔════════════════════════════════════════════════╗");
    console.log("\n");

    // Create shopping cart
    const cart = new ShoppingCart();

    // Add items
    console.log("📝 Step 1: Adding items to cart\n");
    cart.addItem("Laptop", 1200);
    cart.addItem("Wireless Mouse", 25);
    cart.addItem("USB-C Cable", 15);
    cart.addItem("Laptop Bag", 60);

    // Show cart
    cart.showCart();

    // ============================================
    // Scenario 1: Pay with Credit Card
    // ============================================
    console.log("\n\n💳 Scenario 1: Customer chooses Credit Card");
    console.log("─".repeat(50));
    const creditCard = new CreditCardPayment(
        "1234567890123456",
        "123",
        "John Doe"
    );
    cart.setPaymentStrategy(creditCard);
    cart.checkout();

    // ============================================
    // Scenario 2: Customer changes mind - PayPal
    // ============================================
    console.log("\n\n🔄 Scenario 2: Customer changes payment method to PayPal");
    console.log("─".repeat(50));
    const paypal = new PayPalPayment("john.doe@example.com", "securepass123");
    cart.setPaymentStrategy(paypal);
    cart.checkout();

    // ============================================
    // Scenario 3: New customer - Crypto
    // ============================================
    console.log("\n\n🆕 Scenario 3: New customer pays with Cryptocurrency");
    console.log("─".repeat(50));
    const newCart = new ShoppingCart();
    newCart.addItem("Gaming Console", 499);
    newCart.addItem("Controller", 59);
    newCart.showCart();

    const crypto = new CryptoPayment(
        "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        "Bitcoin"
    );
    newCart.setPaymentStrategy(crypto);
    newCart.checkout();

    // ============================================
    // Scenario 4: Bank Transfer
    // ============================================
    console.log("\n\n🏦 Scenario 4: Customer pays via Bank Transfer");
    console.log("─".repeat(50));
    const anotherCart = new ShoppingCart();
    anotherCart.addItem("4K Monitor", 350);
    anotherCart.showCart();

    const bankTransfer = new BankTransferPayment(
        "123456789",
        "987654321",
        "Chase Bank"
    );
    anotherCart.setPaymentStrategy(bankTransfer);
    anotherCart.checkout();

    // ============================================
    // Scenario 5: Invalid payment (demonstration)
    // ============================================
    console.log("\n\n❌ Scenario 5: Invalid payment details");
    console.log("─".repeat(50));
    const invalidCart = new ShoppingCart();
    invalidCart.addItem("Headphones", 79);
    invalidCart.showCart();

    const invalidCard = new CreditCardPayment("123", "1", "Invalid User");
    invalidCart.setPaymentStrategy(invalidCard);
    invalidCart.checkout();

    console.log("\n\n✅ Demo completed!");
    console.log("\n💡 Key Takeaway: Notice how we easily switched between");
    console.log("   different payment strategies without changing the");
    console.log("   ShoppingCart class. That's the power of Strategy Pattern!");
}

// Run the demo
runDemo();

/**
 * TO RUN THIS FILE:
 * 
 * 1. Using ts-node:
 *    npx ts-node examples/strategy-pattern-demo.ts
 * 
 * 2. Compile and run:
 *    tsc examples/strategy-pattern-demo.ts
 *    node examples/strategy-pattern-demo.js
 * 
 * 3. Using Deno:
 *    deno run examples/strategy-pattern-demo.ts
 */
