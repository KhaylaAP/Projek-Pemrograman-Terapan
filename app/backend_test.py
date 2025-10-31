import requests
import sys
import json
from datetime import datetime

class JeansInventoryAPITester:
    def __init__(self, base_url="https://stock-tracker-421.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.created_items = []  # Track created items for cleanup

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_test(name, success, details)
            
            if success:
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_login_valid(self):
        """Test login with valid credentials"""
        return self.run_test(
            "Login - Valid Credentials",
            "POST",
            "login",
            200,
            data={"username": "admin", "password": "admin123"}
        )

    def test_login_invalid(self):
        """Test login with invalid credentials"""
        success, _ = self.run_test(
            "Login - Invalid Credentials",
            "POST",
            "login",
            401,
            data={"username": "wrong", "password": "wrong"}
        )
        return success

    def test_dashboard_stats(self):
        """Test dashboard stats endpoint"""
        return self.run_test("Dashboard Stats", "GET", "dashboard/stats", 200)

    def test_suppliers_crud(self):
        """Test supplier CRUD operations"""
        # Test GET suppliers (empty initially)
        success, suppliers = self.run_test("Get Suppliers - Initial", "GET", "suppliers", 200)
        if not success:
            return False

        # Test CREATE supplier
        supplier_data = {
            "name": "Test Supplier",
            "contact": "test@supplier.com",
            "address": "123 Test Street",
            "payment_terms": "Net 30",
            "active_status": True
        }
        
        success, created_supplier = self.run_test(
            "Create Supplier",
            "POST",
            "suppliers",
            200,
            data=supplier_data
        )
        if not success:
            return False
        
        supplier_id = created_supplier.get('id')
        if supplier_id:
            self.created_items.append(('supplier', supplier_id))

        # Test GET specific supplier
        if supplier_id:
            success, _ = self.run_test(
                "Get Specific Supplier",
                "GET",
                f"suppliers/{supplier_id}",
                200
            )
            if not success:
                return False

        # Test UPDATE supplier
        if supplier_id:
            update_data = {"name": "Updated Test Supplier"}
            success, _ = self.run_test(
                "Update Supplier",
                "PUT",
                f"suppliers/{supplier_id}",
                200,
                data=update_data
            )
            if not success:
                return False

        # Test GET suppliers (should have our created supplier)
        success, suppliers = self.run_test("Get Suppliers - After Create", "GET", "suppliers", 200)
        return success

    def test_inventory_crud(self):
        """Test inventory CRUD operations"""
        # Test GET inventory (empty initially)
        success, inventory = self.run_test("Get Inventory - Initial", "GET", "inventory", 200)
        if not success:
            return False

        # Test CREATE inventory item
        inventory_data = {
            "sku": "TEST-001",
            "size": "32",
            "color": "Blue",
            "quantity": 50,
            "supplier": "Test Supplier"
        }
        
        success, created_item = self.run_test(
            "Create Inventory Item",
            "POST",
            "inventory",
            200,
            data=inventory_data
        )
        if not success:
            return False
        
        item_id = created_item.get('id')
        if item_id:
            self.created_items.append(('inventory', item_id))

        # Test GET specific inventory item
        if item_id:
            success, _ = self.run_test(
                "Get Specific Inventory Item",
                "GET",
                f"inventory/{item_id}",
                200
            )
            if not success:
                return False

        # Test UPDATE inventory item
        if item_id:
            update_data = {"color": "Dark Blue", "quantity": 75}
            success, _ = self.run_test(
                "Update Inventory Item",
                "PUT",
                f"inventory/{item_id}",
                200,
                data=update_data
            )
            if not success:
                return False

        # Test SEARCH inventory
        success, _ = self.run_test(
            "Search Inventory - By Color",
            "GET",
            "inventory?search=Blue",
            200
        )
        if not success:
            return False

        success, _ = self.run_test(
            "Search Inventory - By SKU",
            "GET",
            "inventory?search=TEST",
            200
        )
        return success

    def test_stock_transactions(self):
        """Test stock receive and ship transactions"""
        # First create an inventory item for transactions
        inventory_data = {
            "sku": "TRANS-001",
            "size": "34",
            "color": "Black",
            "quantity": 20,
            "supplier": "Transaction Supplier"
        }
        
        success, created_item = self.run_test(
            "Create Item for Transactions",
            "POST",
            "inventory",
            200,
            data=inventory_data
        )
        if not success:
            return False
        
        item_id = created_item.get('id')
        if not item_id:
            self.log_test("Stock Transactions", False, "No item ID returned")
            return False
        
        self.created_items.append(('inventory', item_id))

        # Test RECEIVE stock
        receive_data = {
            "inventory_id": item_id,
            "quantity": 10,
            "transaction_type": "receive"
        }
        
        success, _ = self.run_test(
            "Receive Stock",
            "POST",
            "inventory/receive",
            200,
            data=receive_data
        )
        if not success:
            return False

        # Test SHIP stock
        ship_data = {
            "inventory_id": item_id,
            "quantity": 5,
            "transaction_type": "ship"
        }
        
        success, _ = self.run_test(
            "Ship Stock",
            "POST",
            "inventory/ship",
            200,
            data=ship_data
        )
        if not success:
            return False

        # Test SHIP more than available (should fail)
        ship_too_much_data = {
            "inventory_id": item_id,
            "quantity": 1000,
            "transaction_type": "ship"
        }
        
        success, _ = self.run_test(
            "Ship Stock - Insufficient Stock",
            "POST",
            "inventory/ship",
            400,
            data=ship_too_much_data
        )
        return success

    def test_error_cases(self):
        """Test various error cases"""
        # Test non-existent supplier
        success, _ = self.run_test(
            "Get Non-existent Supplier",
            "GET",
            "suppliers/non-existent-id",
            404
        )
        if not success:
            return False

        # Test non-existent inventory item
        success, _ = self.run_test(
            "Get Non-existent Inventory Item",
            "GET",
            "inventory/non-existent-id",
            404
        )
        if not success:
            return False

        # Test delete non-existent inventory item
        success, _ = self.run_test(
            "Delete Non-existent Inventory Item",
            "DELETE",
            "inventory/non-existent-id",
            404
        )
        return success

    def cleanup_created_items(self):
        """Clean up created test items"""
        print("\n🧹 Cleaning up created test items...")
        for item_type, item_id in self.created_items:
            if item_type == 'inventory':
                try:
                    response = requests.delete(f"{self.api_url}/inventory/{item_id}")
                    if response.status_code == 200:
                        print(f"✅ Deleted inventory item: {item_id}")
                    else:
                        print(f"⚠️ Failed to delete inventory item: {item_id}")
                except Exception as e:
                    print(f"⚠️ Error deleting inventory item {item_id}: {e}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Jeans Inventory API Tests")
        print(f"📍 Testing API at: {self.api_url}")
        print("=" * 50)

        # Test basic connectivity
        if not self.test_root_endpoint()[0]:
            print("❌ Cannot connect to API. Stopping tests.")
            return False

        # Test authentication
        self.test_login_valid()
        self.test_login_invalid()

        # Test dashboard
        self.test_dashboard_stats()

        # Test CRUD operations
        self.test_suppliers_crud()
        self.test_inventory_crud()

        # Test transactions
        self.test_stock_transactions()

        # Test error cases
        self.test_error_cases()

        # Cleanup
        self.cleanup_created_items()

        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️ {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = JeansInventoryAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_reports/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'total_tests': tester.tests_run,
            'passed_tests': tester.tests_passed,
            'success_rate': (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
            'test_results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())