import React, { useState, useEffect } from 'react';
import { Plus, Tag, Loader2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getPriceTag, addPriceTags } from "@/services/priceTag";

interface PriceTag {
  id: string;
  name: string;
  price?: number;
  currency?: string;
}

interface ApiPriceTag {
  id: number;
  price_in_inr: number;
  type: string;
  type_text: string;
}

const PriceTagForm: React.FC = () => {
  const [priceTags, setPriceTags] = useState<PriceTag[]>([]);
  const [currentPriceTag, setCurrentPriceTag] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [currentCurrency, setCurrentCurrency] = useState<string>('INR');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingPriceTags, setIsLoadingPriceTags] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    loadPriceTags();
  }, []);

  const loadPriceTags = async () => {
    setIsLoadingPriceTags(true);
    try {
      const response = await getPriceTag();

      if (response.success && response.data) {
        const convertedPriceTags: PriceTag[] = response.data.map((apiPriceTag: ApiPriceTag) => ({
          id: apiPriceTag.id.toString(),
          name: apiPriceTag.type_text?.trim() || apiPriceTag.type || '',
          price: apiPriceTag.price_in_inr,
          currency: 'INR'
        }));

        const sortedPriceTags = convertedPriceTags.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setPriceTags(sortedPriceTags);
      }
    } catch (err: any) {
      // Handle error silently or show user-friendly message
    } finally {
      setIsLoadingPriceTags(false);
    }
  };

  const handleAddPriceTag = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();

    if (!currentPriceTag.trim()) {
      return;
    }

    // Check if price tag already exists
    const priceTagExists = priceTags.some(priceTag =>
      priceTag.name.toLowerCase() === currentPriceTag.trim().toLowerCase()
    );

    if (priceTagExists) {
      setError('This price tag already exists.');
      return;
    }

    // Validate price if provided
    if (currentPrice && (isNaN(parseFloat(currentPrice)) || parseFloat(currentPrice) < 0)) {
      setError('Please enter a valid price.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const priceTagData = {
        type_text: currentPriceTag.trim(),
        price_in_inr: currentPrice ? parseFloat(currentPrice) : 0,
      };

      const response = await addPriceTags(priceTagData);

      setCurrentPriceTag('');
      setCurrentPrice('');
      setCurrentCurrency('INR');


      setSuccessMessage(`Price tag "${priceTagData.type_text}" added successfully!`);


      await loadPriceTags();


      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err: any) {
      setError('Error adding price tag. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'name') setCurrentPriceTag(value);
    if (field === 'price') setCurrentPrice(value);
    if (field === 'currency') setCurrentCurrency(value);

    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleRefresh = () => {
    loadPriceTags();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - All Price Tags */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-500" />
              All Price Tags ({priceTags.length})
            </h3>
            <button
              onClick={handleRefresh}
              disabled={isLoadingPriceTags}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              title="Refresh price tags"
            >
              <RefreshCw className={`h-3 w-3 ${isLoadingPriceTags ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoadingPriceTags ? (
              <div className="text-center py-8 text-gray-500">
                <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin" />
                <p>Loading price tags...</p>
              </div>
            ) : priceTags.length > 0 ? (
              priceTags.map((priceTag) => (
                <div key={priceTag.id} className="flex items-center justify-between bg-purple-50 px-4 py-3 rounded-md border border-purple-200 hover:bg-purple-100 transition-colors">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Tag className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-700 font-medium truncate block">{priceTag.name}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>
                          {priceTag.price
                            ? `${priceTag.price.toFixed(2)} ${priceTag.currency}`
                            : 'No price set'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Tag className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No price tags found</p>
                <p className="text-sm mt-1">Add your first price tag to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Add Price Tag Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-500" />
            Add New Price Tag
          </h3>

          <div className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            {/* Price Tag Name */}
            <div>
              <label htmlFor="priceTagName" className="block text-sm font-medium text-gray-700 mb-1">
                Price Tag Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="priceTagName"
                value={currentPriceTag}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter price tag name (e.g., Premium, Basic, Standard)"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAddPriceTag(e)}
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price in INR (Optional)
              </label>
              <input
                type="number"
                id="price"
                value={currentPrice}
                onChange={(e) => handleInputChange('price', e.target.value)}
                disabled={isLoading}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter price in INR (e.g., 200.00)"
              />
            </div>

            <button
              onClick={handleAddPriceTag}
              disabled={isLoading || !currentPriceTag.trim()}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${isLoading || !currentPriceTag.trim()
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Price Tag...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Price Tag
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTagForm;