import { useState } from 'react';
import { SelectedPledges } from '../../types';
import { pledgeCategories } from '../../data/pledges';
import { CheckCircle2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

interface PledgeSelectionStepProps {
  data: SelectedPledges;
  onNext: (data: SelectedPledges) => void;
  onBack: () => void;
}

const categoryColors: Record<string, { bg: string; border: string; text: string; check: string; header: string }> = {
  reduce_reuse_recycle: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    check: 'accent-emerald-600',
    header: 'bg-emerald-600',
  },
  conserve_energy: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    check: 'accent-yellow-600',
    header: 'bg-yellow-500',
  },
  eat_sustainably: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    check: 'accent-green-600',
    header: 'bg-green-600',
  },
  eco_friendly_travel: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-800',
    check: 'accent-teal-600',
    header: 'bg-teal-600',
  },
  community_sustainability: {
    bg: 'bg-lime-50',
    border: 'border-lime-200',
    text: 'text-lime-800',
    check: 'accent-lime-600',
    header: 'bg-lime-600',
  },
};

export default function PledgeSelectionStep({ data, onNext, onBack }: PledgeSelectionStepProps) {
  const [selected, setSelected] = useState<SelectedPledges>(data);
  const [errors, setErrors] = useState<string[]>([]);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const toggleOption = (categoryId: string, option: string) => {
    setSelected(prev => {
      const current = prev[categoryId] || [];
      const updated = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option];
      return { ...prev, [categoryId]: updated };
    });
    if (attemptedSubmit) {
      setErrors(prev => prev.filter(e => e !== categoryId));
    }
  };

  const handleSubmit = () => {
    const missing = pledgeCategories
      .filter(cat => !(selected[cat.id] && selected[cat.id].length > 0))
      .map(cat => cat.id);
    if (missing.length > 0) {
      setErrors(missing);
      setAttemptedSubmit(true);
      const firstError = document.getElementById(`category-${missing[0]}`);
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    onNext(selected);
  };

  const totalSelected = Object.values(selected).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Choose Your Pledges</h2>
        <p className="text-gray-500 mt-1 text-sm">Select at least one pledge from each category below</p>
        <p className="text-yellow-900 font-bold text-left mt-3 text-sm leading-relaxed">
  I pledge to lead a more sustainable lifestyle, taking into account both the environmental and social impact of my actions.I will support and encourage others to take the pledge and choose at least one action from each section, continuing to add new actions toward sustainability.
</p>
<p className="text-yellow-900 font-bold text-left mt-3 text-sm leading-relaxed">
  I will......
</p>
        {totalSelected > 0 && (
          <div className="mt-2 inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {totalSelected} pledge{totalSelected !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      <div className="space-y-5">
        {pledgeCategories.map(category => {
          const colors = categoryColors[category.id];
          const isError = errors.includes(category.id);
          const selectedCount = (selected[category.id] || []).length;

          return (
            <div
              key={category.id}
              id={`category-${category.id}`}
              className={`rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                isError ? 'border-red-400 shadow-red-100 shadow-md' : colors.border
              }`}
            >
              <div className={`${colors.header} px-4 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <h3 className="font-semibold text-white text-sm md:text-base">{category.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {isError && (
                    <div className="flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      Required
                    </div>
                  )}
                  {selectedCount > 0 && (
                    <span className="bg-white/25 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      {selectedCount} selected
                    </span>
                  )}
                </div>
              </div>

              <div className={`${colors.bg} p-4`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.options.map(option => {
                    const isChecked = (selected[category.id] || []).includes(option);
                    return (
                      <label
                        key={option}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all duration-150 border ${
                          isChecked
                            ? `${colors.border} bg-white shadow-sm`
                            : 'border-transparent hover:border-gray-200 hover:bg-white/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleOption(category.id, option)}
                          className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 ${colors.check}`}
                        />
                        <span className={`text-xs leading-relaxed ${colors.text} font-medium`}>
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {isError && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Please select at least one pledge from this category
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex-1 border-2 border-green-600 text-green-700 font-semibold py-3 rounded-lg hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
