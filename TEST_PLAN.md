# Email Generator AI - Test Plan

## Test 1: EN Proofread (Basic)
Input: Text with spelling errors
Expected: Corrected spelling, grammar, punctuation

## Test 2: EN Proofread (Technical Azure Content)
Input: Azure email with typos
Expected: Fixed typos while preserving Azure terminology

## Test 3: PT-BR Proofread
Input: Portuguese text with errors
Expected: Corrected Portuguese grammar and accents

## Test 4: EN to PT-BR Translation
Input: English Azure email
Expected: Professional Portuguese translation

## Test 5: PT-BR to EN Translation
Input: Portuguese Azure email
Expected: Professional English translation

## Test 6: Edge Case - Empty Input
Expected: Error message or graceful handling

## Test 7: Edge Case - Special Characters
Expected: Placeholders preserved unchanged

## Test 8: Console Error Check
Verify: Calling Claude API and API Response appear in console
