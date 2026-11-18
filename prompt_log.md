Plantify App – AI Iterative Prompt & Debugging Log

This log documents the iterative development process of the Plantify mobile application, showcasing the step-by-step feature additions and the bugs/flaws identified and resolved during development.

Phase 1: Initial Core Dashboard & UI Refinement
Prompt Given:

"Create a complete React Native Expo frontend for 'Plantify' with three screens: Login, Plant Dashboard, and Add Plant. Use React useState to manage a list of plants with name, species, and health status, and allow adding and deleting plants."

Flaw / Bug Identified: The initial dashboard UI looked too basic, stretched, and flat, lacking commercial features (like a plant shop for buying plants).

Result: Generated the multi-screen structure and dynamic useState plant list management, which was later expanded.

Phase 2: Scope Expansion (Navigation & Marketplace)
Prompt Given:

"Create a complete, production-ready 'Plantify' mobile application that starts with a professional Splash Screen and includes a full multi-tab navigation system ('My Jungle', 'Shop', 'Cart', 'Profile'), a plant store marketplace grid, and a search filter."

AI Hallucination / Bug Encountered: The AI rendered UI elements like the + Add buttons on the Shop screen, but omitted the actual event handler logic (onPress) and state-binding, meaning clicking them did nothing to update the cart. Furthermore, complete authentication and validation flows were missing.

Phase 3: Fixing Authentication Bypass & Form Validations
Flaw / Security Bug Identified: When generating the Sign Up screen, submitting the form bypassed login entirely and redirected the user straight to the main dashboard without checking email formatting or credentials.

Prompt Given to Fix Bug:

"Fix the authentication bypass bug: prevent direct access to the home screen after Sign Up. Add strict validation for email format (must include '@' and '.') and password length (6+ chars). Introduce a simulated 4-digit OTP verification code step before allowing account activation and transition to Sign In."

Result: Successfully implemented strict regex email checks, password length validation, a secure 4-digit OTP modal workflow, and proper sign-in redirection.

Phase 4: E-Commerce Checkout & Notification Simulation
Prompt Given:

"Add a secure checkout modal with 16-digit credit card numeric validation, a detailed Payment Confirmation Receipt modal showing order details, and a live watering reminder notification banner simulation on the plant care dashboard."

Result: Finalized the application featuring interactive watering notification banners, real-time cart subtotal calculations, 16-digit credit card security checks, and an automated success payment receipt modal.

🔍 Summary of Key Bugs & AI Hallucinations Resolved:

Dummy UI Hallucination: The AI initially generated non-functional + Add buttons in the marketplace that lacked state handlers; fixed by enforcing useState cart integration.

Authentication Bypass Flaw: The app initially allowed direct navigation past the Sign Up screen without validation; fixed by implementing strict email format checks, password lengths, and an interactive OTP verification step.

Missing Payment & Validation Logic: Checkout lacked data verification; fixed by adding a strict 16-digit credit card validator and a custom confirmation receipt modal.