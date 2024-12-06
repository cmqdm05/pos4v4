import React from 'react';
import { Trash2, Plus } from 'lucide-react';

interface ModifierOption {
  name: string;
  price: number;
}

interface Modifier {
  name: string;
  options: ModifierOption[];
}

interface ModifierFormProps {
  modifiers: Modifier[];
  onModifierChange: (index: number, field: string, value: string) => void;
  onModifierOptionChange: (modifierIndex: number, optionIndex: number, field: string, value: string | number) => void;
  onAddModifier: () => void;
  onAddModifierOption: (modifierIndex: number) => void;
  onRemoveModifier: (modifierIndex: number) => void;
  onRemoveModifierOption: (modifierIndex: number, optionIndex: number) => void;
}

const ModifierForm: React.FC<ModifierFormProps> = ({
  modifiers,
  onModifierChange,
  onModifierOptionChange,
  onAddModifier,
  onAddModifierOption,
  onRemoveModifier,
  onRemoveModifierOption,
}) => {
  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Modifiers</h3>
        <button
          type="button"
          onClick={onAddModifier}
          className="text-indigo-600 hover:text-indigo-900"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {modifiers.map((modifier, modifierIndex) => (
        <div key={modifierIndex} className="mb-4 p-4 border rounded-md">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={modifier.name}
              onChange={(e) =>
                onModifierChange(modifierIndex, 'name', e.target.value)
              }
              placeholder="Modifier name"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => onRemoveModifier(modifierIndex)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 mt-2">
            {modifier.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex gap-2">
                <input
                  type="text"
                  value={option.name}
                  onChange={(e) =>
                    onModifierOptionChange(
                      modifierIndex,
                      optionIndex,
                      'name',
                      e.target.value
                    )
                  }
                  placeholder="Option name"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  value={option.price}
                  onChange={(e) =>
                    onModifierOptionChange(
                      modifierIndex,
                      optionIndex,
                      'price',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="Price"
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {modifier.options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveModifierOption(modifierIndex, optionIndex)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => onAddModifierOption(modifierIndex)}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              Add Option
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModifierForm;