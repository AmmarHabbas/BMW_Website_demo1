import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Calendar, MapPin, Shield, User, Mail, Phone, QrCode, Download, Car } from 'lucide-react';
import { FLEET_MODELS, OFFICIAL_DEALERSHIPS } from '../data/fleetData';
import { ModelSpec, Dealership, TestDriveBooking } from '../types/bmw';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedModel?: ModelSpec | null;
  customConfigNote?: string;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  onClose,
  preselectedModel,
  customConfigNote,
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(
    preselectedModel ? preselectedModel.id : FLEET_MODELS[0].id
  );
  const [dealershipSearch, setDealershipSearch] = useState('');
  const [selectedDealershipId, setSelectedDealershipId] = useState<string>(
    OFFICIAL_DEALERSHIPS[0].id
  );
  const [experienceType, setExperienceType] = useState<'Street Luxury' | 'Track Master' | 'Electric Discovery'>(
    'Street Luxury'
  );
  const [preferredDate, setPreferredDate] = useState('2026-10-18');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hasLicense, setHasLicense] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<TestDriveBooking | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (preselectedModel) {
      setSelectedModelId(preselectedModel.id);
    }
  }, [preselectedModel]);

  if (!isOpen) return null;

  const filteredDealerships = OFFICIAL_DEALERSHIPS.filter(
    (d) =>
      d.name.toLowerCase().includes(dealershipSearch.toLowerCase()) ||
      d.city.toLowerCase().includes(dealershipSearch.toLowerCase()) ||
      d.country.toLowerCase().includes(dealershipSearch.toLowerCase())
  );

  const selectedModel = FLEET_MODELS.find((m) => m.id === selectedModelId) || FLEET_MODELS[0];
  const selectedDealership =
    OFFICIAL_DEALERSHIPS.find((d) => d.id === selectedDealershipId) || OFFICIAL_DEALERSHIPS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasLicense) {
      setErrorMessage('Please confirm you possess a valid driver’s license.');
      return;
    }
    if (!fullName || !email || !phone) {
      setErrorMessage('Please complete all contact details.');
      return;
    }

    const bookingCode = `BMW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newBooking: TestDriveBooking = {
      id: crypto.randomUUID(),
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      dealershipId: selectedDealership.id,
      dealershipName: selectedDealership.name,
      experienceType,
      preferredDate,
      preferredTime,
      fullName,
      email,
      phone,
      driversLicenseConfirmed: true,
      createdAt: new Date().toISOString(),
      bookingCode,
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('bmw_test_drives') || '[]');
      existing.push(newBooking);
      localStorage.setItem('bmw_test_drives', JSON.stringify(existing));
    } catch {
      // ignore localStorage quotas
    }

    setConfirmedBooking(newBooking);
    setErrorMessage('');
  };

  const resetForm = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121214] border border-white/15 rounded-xl shadow-2xl p-6 sm:p-8 my-8 text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={resetForm}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation Pass */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-[#0066B1]/20 border border-[#0066B1] rounded-full flex items-center justify-center mx-auto text-[#0066B1]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#0066B1]">
                Official Flagship Reservation
              </div>
              <h3 className="font-display font-bold text-2xl text-white mt-1">
                Your Test Drive Pass is Confirmed
              </h3>
              <p className="text-xs text-white/60 mt-1">
                A personal concierge from BMW will contact you within 2 business hours.
              </p>
            </div>

            {/* Official Digital Ticket Card */}
            <div className="bg-[#080808] border border-white/15 rounded-xl p-6 text-left relative overflow-hidden">
              <div className="h-1.5 w-full bmw-m-stripe absolute top-0 left-0 right-0" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <div className="text-[10px] font-mono text-white/40 uppercase">Vehicle</div>
                  <div className="font-display font-bold text-lg text-white">
                    {confirmedBooking.modelName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-white/40 uppercase">Booking Pass</div>
                  <div className="font-mono font-bold text-base text-[#0066B1]">
                    {confirmedBooking.bookingCode}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <div className="text-white/40 uppercase text-[10px]">Location</div>
                  <div className="text-white mt-0.5">{confirmedBooking.dealershipName}</div>
                </div>
                <div>
                  <div className="text-white/40 uppercase text-[10px]">Date & Time</div>
                  <div className="text-white mt-0.5">
                    {confirmedBooking.preferredDate} · {confirmedBooking.preferredTime}
                  </div>
                </div>
                <div>
                  <div className="text-white/40 uppercase text-[10px]">Driver</div>
                  <div className="text-white mt-0.5">{confirmedBooking.fullName}</div>
                </div>
                <div>
                  <div className="text-white/40 uppercase text-[10px]">Experience Tier</div>
                  <div className="text-white mt-0.5">{confirmedBooking.experienceType}</div>
                </div>
              </div>

              {customConfigNote && (
                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-white/70">
                  <span className="text-[#0066B1] font-mono">Custom Setup:</span> {customConfigNote}
                </div>
              )}
            </div>

            <button
              onClick={resetForm}
              className="w-full py-3 text-xs font-semibold text-black bg-white hover:bg-white/90 rounded-md transition-all"
            >
              Done & Return to Flagship
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#0066B1] mb-1">
                VIP Concierge Reservation
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                Book a Flagship Test Drive
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Select your vehicle of choice, flagship location, and preferred driving experience.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {errorMessage}
              </div>
            )}

            {/* Model Selection */}
            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-2">
                1. Select Vehicle
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full bg-[#080808] border border-white/15 rounded-md px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0066B1]"
              >
                {FLEET_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category}) · From €{m.startingPriceEur.toLocaleString('en-US')}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Program Tier */}
            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-2">
                2. Experience Program
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Street Luxury', desc: 'Urban & Autobahn Comfort' },
                  { id: 'Track Master', desc: 'M Dynamic Handling' },
                  { id: 'Electric Discovery', desc: 'Gen-6 eDrive Focus' },
                ].map((tier) => (
                  <button
                    type="button"
                    key={tier.id}
                    onClick={() =>
                      setExperienceType(tier.id as 'Street Luxury' | 'Track Master' | 'Electric Discovery')
                    }
                    className={`p-3 rounded-md border text-left transition-all ${
                      experienceType === tier.id
                        ? 'border-[#0066B1] bg-[#0066B1]/10 text-white'
                        : 'border-white/10 bg-[#080808] text-white/60 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-semibold">{tier.id}</div>
                    <div className="text-[10px] text-white/50 mt-0.5">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dealership Locator */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-white/60">
                  3. Dealership Center
                </label>
                <span className="text-[11px] text-white/40 font-mono">
                  {filteredDealerships.length} Flagships Available
                </span>
              </div>
              <input
                type="text"
                placeholder="Search by city (e.g. Munich, New York, London, Tokyo, Dubai)..."
                value={dealershipSearch}
                onChange={(e) => setDealershipSearch(e.target.value)}
                className="w-full bg-[#080808] border border-white/15 rounded-md px-3.5 py-2 text-xs text-white mb-2 focus:outline-none focus:border-[#0066B1]"
              />

              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {filteredDealerships.map((d) => (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => setSelectedDealershipId(d.id)}
                    className={`w-full p-2 rounded-md border text-left text-xs transition-all flex items-center justify-between ${
                      selectedDealershipId === d.id
                        ? 'border-white bg-white/10 text-white font-medium'
                        : 'border-white/5 bg-[#080808]/60 text-white/60 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div>{d.name}</div>
                      <div className="text-[10px] text-white/40">{d.address}</div>
                    </div>
                    <div className="text-right text-[10px] font-mono text-[#0066B1]">
                      {d.city}, {d.country}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-2">
                  4. Preferred Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-[#080808] border border-white/15 rounded-md px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0066B1]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-2">
                  Session Time
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-[#080808] border border-white/15 rounded-md px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0066B1]"
                >
                  <option>09:30 AM (Morning Session)</option>
                  <option>11:00 AM (Midday Run)</option>
                  <option>02:30 PM (Afternoon Autobahn)</option>
                  <option>05:00 PM (Sunset Experience)</option>
                </select>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <label className="block text-xs font-mono uppercase text-white/60">
                5. Driver Information
              </label>

              <input
                type="text"
                placeholder="Full Name (as on Driver’s License)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-[#080808] border border-white/15 rounded-md px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0066B1]"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#080808] border border-white/15 rounded-md px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0066B1]"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-[#080808] border border-white/15 rounded-md px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0066B1]"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLicense}
                  onChange={(e) => setHasLicense(e.target.checked)}
                  className="w-4 h-4 accent-[#0066B1] rounded"
                />
                <span className="text-[11px] text-white/70">
                  I confirm that I hold a valid, non-provisional driver's license.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs font-semibold text-black bg-white hover:bg-white/90 rounded-md transition-all shadow-md mt-4"
            >
              Issue Official Digital Test Drive Pass
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
