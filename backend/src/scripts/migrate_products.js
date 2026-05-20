"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
// Load env vars
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Import Product Model directly since we bypass app startup
var product_model_1 = require("../models/product.model");
var migrateProducts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var products, updatedCount, _i, products_1, product, needsSave, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, 8, 10]);
                console.log('Connecting to MongoDB...', process.env.MONGO_URI);
                return [4 /*yield*/, mongoose_1.default.connect(process.env.MONGO_URI)];
            case 1:
                _a.sent();
                console.log('MongoDB Connected.');
                console.log('Starting product migration...');
                return [4 /*yield*/, product_model_1.default.find({})];
            case 2:
                products = _a.sent();
                console.log("Found ".concat(products.length, " products to check/migrate."));
                updatedCount = 0;
                _i = 0, products_1 = products;
                _a.label = 3;
            case 3:
                if (!(_i < products_1.length)) return [3 /*break*/, 6];
                product = products_1[_i];
                needsSave = false;
                // @ts-ignore
                if (product.inStock === undefined) {
                    product.inStock = true;
                    needsSave = true;
                }
                // @ts-ignore
                if (product.onSale === undefined) {
                    product.onSale = false;
                    needsSave = true;
                }
                // Initialize arrays if they don't exist
                // @ts-ignore
                if (!product.sizes || product.sizes.length === 0) {
                    product.sizes = ['S', 'M', 'L']; // Default some sizes
                    needsSave = true;
                }
                // @ts-ignore
                if (!product.additionalImages) {
                    product.additionalImages = [];
                    needsSave = true;
                }
                // @ts-ignore
                if (!product.vendor) {
                    product.vendor = 'CartifyX';
                    needsSave = true;
                }
                // @ts-ignore
                if (!product.productType) {
                    product.productType = product.category || 'Standard';
                    needsSave = true;
                }
                // @ts-ignore
                if (product.viewCount === undefined) {
                    // Give older products a nice fake view count based on their rating/reviews
                    product.viewCount = Math.floor(Math.random() * 500) + 150;
                    needsSave = true;
                }
                // @ts-ignore
                if (product.soldCount === undefined) {
                    // Give older products a fake sold count correlated to their reviews
                    product.soldCount = (product.reviews || 0) * 3 + Math.floor(Math.random() * 20);
                    needsSave = true;
                }
                if (!needsSave) return [3 /*break*/, 5];
                return [4 /*yield*/, product.save()];
            case 4:
                _a.sent();
                updatedCount++;
                console.log("Migrated Product: ".concat(product.name));
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                console.log('Migration Complete.');
                console.log("Total Products Updated: ".concat(updatedCount, " out of ").concat(products.length, "."));
                return [3 /*break*/, 10];
            case 7:
                error_1 = _a.sent();
                console.error('Migration failed:', error_1);
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, mongoose_1.default.disconnect()];
            case 9:
                _a.sent();
                process.exit(0);
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
migrateProducts();
