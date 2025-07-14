import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordInputProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  label?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value = '',
  onChange,
  disabled = false,
  label = 'Senha (6 dígitos)'
}) => {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // Sincronizar com valor externo
  useEffect(() => {
    if (value && value.length <= 6) {
      const newDigits = value.split('').concat(Array(6 - value.length).fill(''));
      setDigits(newDigits.slice(0, 6));
    }
  }, [value]);

  const handleInputChange = (index: number, newValue: string) => {
    // Permitir apenas números
    if (newValue && !/^\d$/.test(newValue)) {
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = newValue;
    setDigits(newDigits);

    // Chamar onChange com o valor completo
    const fullValue = newDigits.join('');
    onChange?.(fullValue);

    // Focar no próximo campo se um dígito foi inserido
    if (newValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace: focar no campo anterior se o atual estiver vazio
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Seta direita: próximo campo
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Seta esquerda: campo anterior
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData) {
      const newDigits = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setDigits(newDigits.slice(0, 6));
      onChange?.(pastedData);
      
      // Focar no próximo campo vazio ou no último
      const nextEmptyIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2 justify-center">
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className="w-12 h-12 text-center text-lg font-bold border-2 focus:border-primary"
            autoComplete="off"
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordInput;