import { readFileSync } from "fs";

const LightningClient = require('clightning-client');
const os = require('os');
const path = require('path');
const lightningclient = LightningClient(path.join(os.homedir(), '.lightning', 'regtest', 'lightning-rpc'));

describe('Evaluate submission', () => {
    let paymentHash: string;
    let bolt11: string;
    let amount: number;
    let description: string;
    let expiry: number;

    it('should read and parse out.txt', () => {
        const lines = readFileSync('out.txt', 'utf-8').trim().split('\n');
        expect(lines).toHaveLength(5);

        paymentHash = lines[0].trim();
        bolt11 = lines[1].trim();
        amount = parseInt(lines[2].trim(), 10);
        description = lines[3].trim();
        expiry = parseInt(lines[4].trim(), 10);

        expect(paymentHash).toBeTruthy();
        expect(bolt11).toBeTruthy();
        expect(amount).toBeDefined();
        expect(description).toBeTruthy();
        expect(expiry).toBeDefined();
    });

    it('should have valid payment hash format (64 hex characters)', () => {
        expect(paymentHash).toMatch(/^[a-f0-9]{64}$/);
        expect(paymentHash.length).toBe(64);
    });

    it('should have valid BOLT11 invoice format', () => {
        expect(bolt11).toMatch(/^lnbcrt[a-z0-9]+$/i);
        expect(bolt11.length).toBeGreaterThan(100);
    });

    it('should have description as "Coffee Payment"', () => {
        expect(description).toBe('Coffee Payment');
    });

    it('should have amount as 50000000', () => {
        expect(amount).toBe(50000000)
    });

    it('should have expiry as 3600 seconds', () => {
        expect(expiry).toBe(3600);
    });

    it('should verify invoice details via lightning-cli', async () => {
        const decoded = await lightningclient.decodepay(bolt11);

        expect(decoded).toBeDefined();
        expect(decoded.payment_hash).toBe(paymentHash);
        expect(decoded.amount_msat).toBe(50000000);
        expect(decoded.description).toBe('Coffee Payment');
        expect(decoded.expiry).toBe(3600);
    });

    it('should have valid invoice in node', async () => {
        const invoices = await lightningclient.listinvoices();

        expect(invoices.invoices).toBeDefined();
        expect(invoices.invoices.length).toBeGreaterThan(0);

        const invoice = invoices.invoices.find((inv: any) => inv.payment_hash === paymentHash);

        expect(invoice).toBeDefined();
        expect(invoice.bolt11).toBe(bolt11);
        expect(invoice.amount_msat).toBe(50000000);
        expect(invoice.description).toBe('Coffee Payment');
    });
});
