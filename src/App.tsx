import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import StepIndicator from './components/StepIndicator';
import UserDetailsStep from './components/steps/UserDetailsStep';
import PledgeSelectionStep from './components/steps/PledgeSelectionStep';
import PhotoCaptureStep from './components/steps/PhotoCaptureStep';
import Certificate from './components/Certificate';
import { FormData, UserDetails, SelectedPledges } from './types';
import { supabase } from './lib/supabase';

const STEPS = [
  { label: 'Your Details', icon: '👤' },
  { label: 'Pledges', icon: '🌱' },
  { label: 'Photo', icon: '📷' },
  { label: 'Certificate', icon: '🎓' },
];

const DEFAULT_FORM: FormData = {
  userDetails: {
    name: '',
    email: '',
    rollNo: '',
    institution: '',
  },
  pledges: {},
  photoUrl: null,
};

export default function App() { const [currentStep, setCurrentStep] = useState(0); const [formData, setFormData] = useState<FormData>(DEFAULT_FORM); const [submissionId, setSubmissionId] = useState<string | null>(null); const [saving, setSaving] = useState(false); const handleUserDetails = (details: UserDetails) => { setFormData(prev => ({ ...prev, userDetails: details })); setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handlePledges = (pledges: SelectedPledges) => {
    setFormData(prev => ({ ...prev, pledges }));
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePhoto = async (photoUrl: string) => {
    const updated: FormData = { ...formData, photoUrl };
    setFormData(updated);
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('pledge_submissions')
        .insert({
          name: updated.userDetails.name,
          email: updated.userDetails.email,
          institution: updated.userDetails.institution,
          roll_no: updated.userDetails.rollNo,
          pledges: updated.pledges,
          photo_url: photoUrl,
        })
        .select('id')
        .maybeSingle();

      if (!error && data) {
        setSubmissionId(data.id);
      }
    } finally {
      setSaving(false);
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setFormData(DEFAULT_FORM);
    setSubmissionId(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 md:p-8">
          {saving && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl p-6 flex items-center gap-3 shadow-xl">
                <div className="w-6 h-6 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-700 font-medium">Saving your pledge...</span>
              </div>
            </div>
          )}

          {currentStep === 0 && (
            <UserDetailsStep data={formData.userDetails} onNext={handleUserDetails} />
          )}
          {currentStep === 1 && (
            <PledgeSelectionStep
              data={formData.pledges}
              onNext={handlePledges}
              onBack={() => setCurrentStep(0)}
            />
          )}
          {currentStep === 2 && (
            <PhotoCaptureStep
              photoUrl={formData.photoUrl}
              onNext={handlePhoto}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <>
              <Certificate formData={formData} submissionId={submissionId} />
              <div className="text-center mt-8">
                <button
                  onClick={handleRestart}
                  className="text-sm text-gray-500 hover:text-green-700 underline transition-colors"
                >
                  Start a new pledge
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
