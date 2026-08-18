import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ImagePlus, X, Loader2, Sparkles, Wand2 } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import { aiService } from "../services/aiService";

const CONDITIONS = [
  { value: "NEW", label: "New" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "USED", label: "Used" },
];

export default function Sell() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // AI assist state
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiApplied, setAiApplied] = useState(false);
  const [aiMockMode, setAiMockMode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    categoryService.list().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const addImage = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setImageUrlInput("");
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAiAssist = async () => {
    if (aiInput.trim().length < 5) {
      setAiError("Type a bit more detail first — e.g. \"Old iPhone 13, 128GB, good condition, battery 88%\"");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const res = await aiService.listingAssist(aiInput);
      const s = res.data;

      // Fill the form fields — the seller can still edit every one of these
      // before publishing. Nothing here is saved until they submit.
      setValue("title", s.title);
      setValue("description", s.description);
      setValue("price", Math.round((s.priceMin + s.priceMax) / 2));
      setValue("condition", s.condition);
      if (s.categoryId) setValue("category", s.categoryId);

      setAiMockMode(s.mockMode);
      setAiApplied(true);
    } catch (err) {
      setAiError(err.message || "Could not generate suggestions");
    } finally {
      setAiLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        price: Number(values.price),
        category: values.category,
        condition: values.condition,
        location: values.location,
        quantity: Number(values.quantity) || 1,
        brand: values.brand || undefined,
        images: images.map((url) => ({ url })),
      };
      const res = await productService.create(payload);
      navigate(`/products/${res.data._id}`);
    } catch (err) {
      setError(err.message || "Could not create this listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink_text-hi">List a new item</h1>
      <p className="mt-1 text-sm text-ink_text-mid">
        Fill in the details below — you can edit or pause this listing anytime from your profile.
      </p>

      {/* AI Listing Assistant */}
      <div className="mt-6 rounded-2xl border border-ember/30 bg-ember/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-ember" />
          <h2 className="text-sm font-medium text-ink_text-hi">AI listing assistant</h2>
        </div>
        <p className="mt-1.5 text-xs text-ink_text-mid">
          Describe the item in your own words — AI will draft a title, description,
          category, condition, and price range. Review and edit everything before publishing.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder='e.g. "Old iPhone 13, 128GB, good condition, battery 88%"'
            className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink_text-hi placeholder:text-ink_text-low outline-none focus:border-ember"
          />
          <Button type="button" onClick={handleAiAssist} disabled={aiLoading} className="shrink-0">
            {aiLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Wand2 size={15} /> Generate
              </>
            )}
          </Button>
        </div>
        {aiError && <p className="mt-2 text-xs text-signal-red">{aiError}</p>}
        {aiApplied && (
          <p className="mt-2 text-xs text-signal-green">
            ✓ Draft filled in below — review and edit before publishing.
            {aiMockMode && " (Demo mode — connect an AI_API_KEY for real suggestions.)"}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="e.g. Apple iPhone 13 128GB — Good Condition"
          error={errors.title?.message}
          {...register("title", { required: "Title is required" })}
        />

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink_text-mid">Description</span>
          <textarea
            rows={5}
            placeholder="Condition, usage history, what's included…"
            className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-ink_text-hi placeholder:text-ink_text-low outline-none focus:border-ember"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && (
            <span className="mt-1 block text-xs text-signal-red">{errors.description.message}</span>
          )}
        </label>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (₹)"
            type="number"
            min="0"
            placeholder="0"
            error={errors.price?.message}
            {...register("price", { required: "Price is required", min: { value: 0, message: "Must be positive" } })}
          />
          <Input
            label="Quantity"
            type="number"
            min="1"
            defaultValue={1}
            {...register("quantity")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink_text-mid">Category</span>
            <select
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-ink_text-hi outline-none focus:border-ember"
              {...register("category", { required: "Category is required" })}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="mt-1 block text-xs text-signal-red">{errors.category.message}</span>
            )}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink_text-mid">Condition</span>
            <select
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-ink_text-hi outline-none focus:border-ember"
              {...register("condition", { required: "Condition is required" })}
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.condition && (
              <span className="mt-1 block text-xs text-signal-red">{errors.condition.message}</span>
            )}
          </label>
        </div>

        <Input
          label="Location"
          placeholder="e.g. Jaipur, RJ"
          error={errors.location?.message}
          {...register("location", { required: "Location is required" })}
        />

        <Input label="Brand (optional)" placeholder="e.g. Apple" {...register("brand")} />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink_text-mid">
            Photos (paste image URLs for now)
          </span>
          <div className="flex gap-2">
            <input
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              placeholder="https://… (paste and press Enter, or click Add)"
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink_text-hi placeholder:text-ink_text-low outline-none focus:border-ember"
            />
            <Button type="button" variant="secondary" onClick={addImage}>
              <ImagePlus size={15} /> Add
            </Button>
          </div>
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((url, i) => (
                <div key={i} className="relative h-16 w-16 overflow-hidden rounded-xl border border-line">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/80"
                  >
                    <X size={11} className="text-ink_text-hi" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {images.length === 0 && (
            <p className="mt-1.5 text-xs text-signal-amber">
              No photo added yet — the listing will show a placeholder image until you add one.
            </p>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-signal-red/10 px-3 py-2 text-sm text-signal-red">{error}</p>
        )}

        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Publishing…
            </>
          ) : (
            "Publish listing"
          )}
        </Button>
      </form>
    </div>
  );
}