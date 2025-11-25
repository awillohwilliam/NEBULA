/*
  # Add Helper Functions

  ## New Functions
  
  ### `increment_total_savings`
  - Helper function to safely increment user's total savings
  - Parameters:
    - `p_user_id` (uuid) - User ID
    - `p_amount` (numeric) - Amount to add to savings
  - Returns: void
  
  ## Purpose
  This function provides a safe way to increment user savings without race conditions.
*/

-- Create function to increment user savings
CREATE OR REPLACE FUNCTION increment_total_savings(
  p_user_id uuid,
  p_amount numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users
  SET total_savings = COALESCE(total_savings, 0) + p_amount,
      updated_at = now()
  WHERE id = p_user_id;
END;
$$;
