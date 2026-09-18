import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Plus,
  Trash2,
  FileText,
  DollarSign,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { Button, Input, Select, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../../components/ui';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHero } from '../../components/layout/PageHero';

const CATEGORIES = [
  { label: 'Apparel & Merchandise', value: 'Apparel & Merchandise' },
  { label: 'Furniture & Decor', value: 'Furniture & Decor' },
  { label: 'Electronics & Hardware', value: 'Electronics & Hardware' },
  { label: 'Photography & Media', value: 'Photography & Media' },
  { label: 'Event & Catering', value: 'Event & Catering' },
  { label: 'Printing & Packaging', value: 'Printing & Packaging' },
  { label: 'Corporate Gifting', value: 'Corporate Gifting' },
  { label: 'Industrial & Metals', value: 'Industrial & Metals' },
  { label: 'Services & IT', value: 'Services & IT' },
];

const UNITS = [
  { label: 'Units / Pieces', value: 'Units' },
  { label: 'Sets', value: 'Sets' },
  { label: 'Boxes', value: 'Boxes' },
  { label: 'Kg / Kilograms', value: 'Kg' },
  { label: 'Meters', value: 'Meters' },
  { label: 'Hours', value: 'Hours' },
  { label: 'Days', value: 'Days' },
];

const DELIVERY_PREFERENCES = [
  { label: 'Standard Delivery to Address', value: 'Standard Delivery' },
  { label: 'Express Expedited Shipping', value: 'Express Shipping' },
  { label: 'Self Pickup from Vendor', value: 'Vendor Pickup' },
];

export const PostRequirementPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { addRequirement } = useRequirementStore();

  const prefilledTitle = searchParams.get('title') || '';

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequirementId, setCreatedRequirementId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(prefilledTitle);
  const [category, setCategory] = useState('Apparel & Merchandise');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(100);
  const [unit, setUnit] = useState('Units');
  const [minBudget, setMinBudget] = useState<number>(15000);
  const [maxBudget, setMaxBudget] = useState<number>(30000);
  const [location, setLocation] = useState('Chennai, Tamil Nadu');
  const [deadline, setDeadline] = useState('7 days');
  const [deliveryPref, setDeliveryPref] = useState('Standard Delivery');
  const [specifications, setSpecifications] = useState<string[]>([
    'High quality 100% bio-washed cotton',
    'Custom logo screen print on front & back',
    'Individually poly-bagged with size labels',
  ]);
  const [newSpec, setNewSpec] = useState('');
  const [attachments, setAttachments] = useState<string[]>([
    'logo_design_reference.pdf',
    'color_palette_guide.png',
  ]);
  const [mockFileName, setMockFileName] = useState('');

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddSpec = () => {
    if (newSpec.trim()) {
      setSpecifications([...specifications, newSpec.trim()]);
      setNewSpec('');
    }
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleAddMockFile = () => {
    if (mockFileName.trim()) {
      setAttachments([...attachments, mockFileName.trim()]);
      setMockFileName('');
    } else {
      setAttachments([...attachments, `attachment_sample_${attachments.length + 1}.pdf`]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!title.trim()) errs.title = 'Requirement title is required';
      if (!category) errs.category = 'Please select a category';
      if (!description.trim() || description.trim().length < 15) {
        errs.description = 'Please provide a detailed description (at least 15 characters)';
      }
    } else if (currentStep === 2) {
      if (!quantity || quantity <= 0) errs.quantity = 'Quantity must be greater than 0';
      if (!minBudget || minBudget <= 0) errs.minBudget = 'Minimum budget is required';
      if (!maxBudget || maxBudget < minBudget) errs.maxBudget = 'Maximum budget must be greater than or equal to minimum budget';
    } else if (currentStep === 3) {
      if (!location.trim()) errs.location = 'Delivery location is required';
      if (!deadline.trim()) errs.deadline = 'Deadline / required date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 600));

      const newReq = addRequirement({
        customerId: user?.id || 'cust-101',
        customerName: user?.name || 'Saad (Customer)',
        title,
        category,
        description,
        quantity,
        unit,
        minBudget,
        maxBudget,
        location,
        deadline,
        specifications,
        attachments,
      });

      setCreatedRequirementId(newReq.id);
    } catch (err) {
      console.error('Failed to post requirement:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdRequirementId) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[70vh]">
        <Card variant="elevated" className="text-center p-8 max-w-xl w-full">
          <div className="w-16 h-16 bg-[#2BD696]/20 border border-[#2BD696]/30 rounded-full flex items-center justify-center mx-auto mb-6 text-[#2BD696] shadow-lg shadow-[#2BD696]/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <Badge variant="success" size="lg" className="mb-3">
            Requirement Live
          </Badge>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FF] mb-3">
            Requirement Posted Successfully!
          </h1>

          <p className="text-[#9DA9C6] mb-6 text-sm leading-relaxed max-w-md mx-auto">
            Your request <span className="font-semibold text-[#F5F7FF]">"{title}"</span> has been broadcast to verified matching vendors. Quotations will start arriving shortly.
          </p>

          <div className="bg-[#131A32] rounded-xl p-4 mb-8 border border-white/8 text-left text-xs space-y-2 font-mono-tech">
            <div className="flex justify-between">
              <span className="text-[#6F7D9C]">Requirement ID:</span>
              <span className="font-bold text-[#6B8CFF]">{createdRequirementId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F7D9C]">Target Budget:</span>
              <span className="font-semibold text-[#2BD696]">{formatINR(maxBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F7D9C]">Matching Vendors Notified:</span>
              <span className="font-semibold text-[#2BD696]">14 Verified Vendors</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/customer/requirements/${createdRequirementId}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Requirement Details
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/customer/dashboard')}
              leftIcon={<LayoutDashboard className="w-4 h-4" />}
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHero
        eyebrow="Reverse Marketplace Builder"
        title="Post Your"
        titleHighlight="Requirement"
        description="Specify what you need and let qualified vendors compete with custom quotes."
        bgText="REQUIREMENTS"
      />

      {/* Progress Steps Header */}
      <Card variant="elevated" className="mb-8 p-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto font-mono-tech">
          {[
            { num: 1, title: 'What do you need?' },
            { num: 2, title: 'Quantity & Budget' },
            { num: 3, title: 'Delivery' },
            { num: 4, title: 'Specifications' },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <button
                type="button"
                onClick={() => {
                  if (s.num < step) setStep(s.num);
                }}
                className={`flex items-center gap-2 transition-all cursor-pointer ${
                  s.num === step
                    ? 'text-[#6B8CFF] font-bold'
                    : s.num < step
                    ? 'text-[#2BD696] font-medium'
                    : 'text-[#6F7D9C] font-normal cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    s.num === step
                      ? 'bg-[#5B37F5] text-white ring-4 ring-[#5B37F5]/25 shadow-md'
                      : s.num < step
                      ? 'bg-[#2BD696] text-[#050816]'
                      : 'bg-[#131A32] text-[#6F7D9C] border border-white/10'
                  }`}
                >
                  {s.num < step ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className="hidden md:inline text-xs">{s.title}</span>
              </button>
              {idx < 3 && (
                <div className="flex-1 h-0.5 mx-2 rounded-full hidden sm:block bg-white/10 relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#2BD696] rounded-full transition-all duration-300"
                    style={{ width: s.num < step ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Main Grid: Form + Live Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wizard Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated" className="p-6 sm:p-8">
            {step === 1 && (
              <div className="space-y-5">
                <div className="border-b border-white/8 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-[#F5F7FF] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#6B8CFF]" /> Step 1: What do you need?
                  </h2>
                  <p className="text-xs text-[#9DA9C6]">Give your requirement a clear title and detailed overview.</p>
                </div>

                <Input
                  label="Requirement Title *"
                  placeholder="e.g. 100 Customized T-Shirts for Corporate Tech Event"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                />

                <Select
                  label="Category *"
                  options={CATEGORIES}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  error={errors.category}
                />

                <Textarea
                  label="Detailed Description *"
                  placeholder="Describe your exact needs, intended use, quality expectations, sizing breakdown, printing details, etc..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={errors.description}
                  helperText="Be detailed so vendors can submit precise & competitive price quotes."
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="border-b border-white/8 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-[#F5F7FF] flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#6B8CFF]" /> Step 2: Quantity & Budget Range
                  </h2>
                  <p className="text-xs text-[#9DA9C6]">Define the quantity required and your expected budget scope.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Quantity *"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    error={errors.quantity}
                  />

                  <Select
                    label="Unit of Measurement *"
                    options={UNITS}
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>

                <div className="bg-[#131A32] border border-white/10 rounded-2xl p-4 space-y-4">
                  <span className="text-xs font-bold text-[#6B8CFF] uppercase tracking-wider block font-mono-tech">
                    Target Budget Range (INR ₹)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Minimum Budget (₹) *"
                      type="number"
                      step={500}
                      value={minBudget}
                      onChange={(e) => setMinBudget(Number(e.target.value))}
                      error={errors.minBudget}
                    />

                    <Input
                      label="Maximum Budget (₹) *"
                      type="number"
                      step={500}
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      error={errors.maxBudget}
                    />
                  </div>

                  <div className="text-xs text-[#2BD696] bg-[#0F1428] p-3 rounded-xl border border-white/8 flex items-center justify-between font-mono-tech">
                    <span>Estimated Target Range:</span>
                    <span className="font-bold">{formatINR(minBudget)} — {formatINR(maxBudget)}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="border-b border-white/8 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-[#F5F7FF] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#6B8CFF]" /> Step 3: Location & Delivery Expectations
                  </h2>
                  <p className="text-xs text-[#9DA9C6]">Where should vendors deliver, and by when do you need this?</p>
                </div>

                <Input
                  label="Delivery Location (City / State / Pincode) *"
                  placeholder="e.g. T. Nagar, Chennai, Tamil Nadu - 600017"
                  leftIcon={<MapPin className="w-4 h-4 text-[#6F7D9C]" />}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  error={errors.location}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Deadline / Target Date *"
                    placeholder="e.g. 7 days or 2026-09-20"
                    leftIcon={<Calendar className="w-4 h-4 text-[#6F7D9C]" />}
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    error={errors.deadline}
                  />

                  <Select
                    label="Delivery Preference"
                    options={DELIVERY_PREFERENCES}
                    value={deliveryPref}
                    onChange={(e) => setDeliveryPref(e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div className="border-b border-white/8 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-[#F5F7FF] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#6B8CFF]" /> Step 4: Technical Specifications & Attachments
                  </h2>
                  <p className="text-xs text-[#9DA9C6]">Add granular requirements or design reference files.</p>
                </div>

                {/* Specifications List Builder */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-[#9DA9C6] uppercase font-mono-tech">Key Specifications / Requirements</label>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a key requirement (e.g. GSM weight, fabric type, packaging requirement)"
                      value={newSpec}
                      onChange={(e) => setNewSpec(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSpec();
                        }
                      }}
                    />
                    <Button type="button" variant="secondary" onClick={handleAddSpec} leftIcon={<Plus className="w-4 h-4" />}>
                      Add
                    </Button>
                  </div>

                  {specifications.length > 0 && (
                    <ul className="space-y-2 mt-3 font-mono-tech">
                      {specifications.map((spec, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between bg-[#131A32] border border-white/10 px-3 py-2 rounded-xl text-xs text-[#F5F7FF]"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5B37F5]"></span>
                            {spec}
                          </span>
                          <button type="button" onClick={() => handleRemoveSpec(idx)} className="text-[#6F7D9C] hover:text-[#FF5677] transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Attachments Section */}
                <div className="space-y-3 pt-3 border-t border-white/8 font-mono-tech">
                  <label className="text-xs font-semibold text-[#9DA9C6] uppercase">Reference Images & Mockups (Optional)</label>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Mock attachment filename (e.g. tech_pack.pdf)"
                      value={mockFileName}
                      onChange={(e) => setMockFileName(e.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={handleAddMockFile} leftIcon={<Upload className="w-4 h-4" />}>
                      Upload
                    </Button>
                  </div>

                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {attachments.map((file, idx) => (
                        <Badge key={idx} variant="info" className="flex items-center gap-1.5 px-3 py-1.5 text-xs">
                          <FileText className="w-3.5 h-3.5" />
                          {file}
                          <button type="button" onClick={() => handleRemoveAttachment(idx)} className="ml-1 text-[#6B8CFF] hover:text-white cursor-pointer">
                            &times;
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="mt-8 pt-4 border-t border-white/8 flex items-center justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={handlePrev} leftIcon={<ChevronLeft className="w-4 h-4" />}>
                  Previous
                </Button>
              ) : <div />}

              {step < 4 ? (
                <Button variant="primary" onClick={handleNext} rightIcon={<ChevronRight className="w-4 h-4" />}>
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Post Requirement Now
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Live Requirement Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4 font-mono-tech">
            <Card variant="elevated">
              <CardHeader className="border-b border-white/8 pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="info" size="sm">Live Preview</Badge>
                  <span className="text-[10px] text-[#6F7D9C] font-medium">Step {step} of 4</span>
                </div>
                <CardTitle className="text-base font-bold text-[#F5F7FF] mt-2 font-sans">
                  Requirement Summary
                </CardTitle>
                <CardDescription>How matching vendors will view your posting</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-4 text-xs">
                <div>
                  <span className="text-[#6F7D9C] block text-[10px] uppercase font-semibold mb-0.5">Title</span>
                  <p className="font-bold text-[#F5F7FF] text-sm leading-snug font-sans">
                    {title.trim() || <span className="italic text-[#6F7D9C]">Untitled Requirement</span>}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/8">
                  <div>
                    <span className="text-[#6F7D9C] block text-[10px] uppercase font-semibold">Category</span>
                    <span className="font-semibold text-[#F5F7FF]">{category}</span>
                  </div>
                  <div>
                    <span className="text-[#6F7D9C] block text-[10px] uppercase font-semibold">Quantity</span>
                    <span className="font-semibold text-[#6B8CFF]">{quantity} {unit}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/8">
                  <span className="text-[#6F7D9C] block text-[10px] uppercase font-semibold mb-1">Target Budget Range</span>
                  <span className="text-base font-extrabold text-[#2BD696] block font-sans">
                    {formatINR(minBudget)} – {formatINR(maxBudget)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/8">
                  <div>
                    <span className="text-[#6F7D9C] block text-[10px] uppercase font-semibold">Location</span>
                    <span className="font-medium text-[#F5F7FF] truncate block">{location || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-[#6F7D9C] block text-[10px] uppercase font-semibold">Deadline</span>
                    <span className="font-medium text-[#F5F7FF]">{deadline || 'Not set'}</span>
                  </div>
                </div>

                {specifications.length > 0 && (
                  <div className="pt-2 border-t border-white/8">
                    <span className="text-[#6F7D9C] block text-[10px] uppercase font-semibold mb-1">
                      Specifications ({specifications.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {specifications.slice(0, 3).map((s, i) => (
                        <span key={i} className="bg-[#131A32] text-[#F5F7FF] text-[10px] px-2 py-0.5 rounded-md truncate max-w-full">
                          • {s}
                        </span>
                      ))}
                      {specifications.length > 3 && (
                        <span className="text-[10px] text-[#6B8CFF] font-semibold">+ {specifications.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-[#0F1428] text-[#F5F7FF] rounded-2xl p-4 border border-white/8 text-xs space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-[#6B8CFF]">
                <Sparkles className="w-4 h-4 text-[#48CBFF]" /> Reverse Marketplace Guarantee
              </span>
              <p className="text-[#9DA9C6] leading-relaxed">
                Vendors will compete with transparent quotes. You maintain 100% control to compare ratings, warranties, & pricing before accepting any offer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default PostRequirementPage;
