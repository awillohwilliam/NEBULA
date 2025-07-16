import React, { useState, useEffect } from 'react';
import { Check, X, Loader } from 'lucide-react';
import { useNetworks } from '../hooks/useNetworks';

interface PhoneNumberValidatorProps {
  phoneNumber: string;
  selectedNetwork: string;
  onValidationChange: (isValid: boolean, carrier?: string) => void;
}

const PhoneNumberValidator: React.FC<PhoneNumberValidatorProps> = ({
  phoneNumber,
  selectedNetwork,
  onValidationChange,
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    carrier: string;
  } | null>(null);
  
  const { verifyPhoneNumber } = useNetworks();

  useEffect(() => {
    const validatePhone = async () => {
      if (!phoneNumber || phoneNumber.length < 11 || !selectedNetwork) {
        setValidationResult(null);
        onValidationChange(false);
        return;
      }

      setIsValidating(true);
      try {
        const result = await verifyPhoneNumber(phoneNumber, selectedNetwork);
        setValidationResult(result);
        onValidationChange(result.valid, result.carrier);
      } catch (error) {
        setValidationResult({ valid: false, carrier: '' });
        onValidationChange(false);
      } finally {
        setIsValidating(false);
      }
    };

    const debounceTimer = setTimeout(validatePhone, 500);
    return () => clearTimeout(debounceTimer);
  }, [phoneNumber, selectedNetwork, verifyPhoneNumber, onValidationChange]);

  if (!phoneNumber || phoneNumber.length < 11) return null;

  return (
    <div className="mt-2">
      {isValidating ? (
        <div className="flex items-center space-x-2 text-blue-600">
          <Loader className="w-4 h-4 animate-spin" />
          <span className="text-sm">Validating number...</span>
        </div>
      ) : validationResult ? (
        <div className={`flex items-center space-x-2 ${
          validationResult.valid ? 'text-green-600' : 'text-red-600'
        }`}>
          {validationResult.valid ? (
            <Check className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
          <span className="text-sm">
            {validationResult.valid
              ? `Valid ${validationResult.carrier} number`
              : 'Invalid phone number or network mismatch'
            }
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default PhoneNumberValidator;