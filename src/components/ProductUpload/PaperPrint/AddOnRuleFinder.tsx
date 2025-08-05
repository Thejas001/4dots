import React from 'react';
import { PaperPrintingPricingRule } from '@/app/models/products';

interface PricingRuleDebuggerProps {
  pricingRules: PaperPrintingPricingRule[];
  selectedSize: string;
  selectedColor: string;
  pageCount: number;
}

const PricingRuleDebugger: React.FC<PricingRuleDebuggerProps> = ({
  pricingRules,
  selectedSize,
  selectedColor,
  pageCount
}) => {
  const normalizeSizeName = (size: string) => {
    return size
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/single sided/g, 'single side')
      .replace(/double sided/g, 'double side');
  };

  const normalizedSelectedSize = normalizeSizeName(selectedSize);
  const mappedColor = selectedColor === "B/W" ? "BlackAndWhite" : "Color";

  // Find matching rules
  const matchingRules = pricingRules.filter(rule => {
    const ruleSize = normalizeSizeName(rule.PaperSize?.ValueName || "");
    const ruleColor = rule.ColorType?.ValueName || "";
    
    return ruleSize === normalizedSelectedSize && ruleColor === mappedColor;
  });

  // Find page range matches
  const pageRangeMatches = pricingRules.filter(rule => {
    const pageRangeStr = rule.PageRange?.ValueName || "";
    
    if (pageRangeStr.includes("above")) {
      const min = parseInt(pageRangeStr.split("-")[0]);
      return pageCount >= min;
    }
    
    const [min, max] = pageRangeStr.split("-").map(Number);
    return pageCount >= min && pageCount <= max;
  });

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔍 Pricing Rule Debugger</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Selected Size:</strong> {selectedSize}
        </div>
        <div>
          <strong>Normalized Size:</strong> {normalizedSelectedSize}
        </div>
        <div>
          <strong>Selected Color:</strong> {selectedColor} → {mappedColor}
        </div>
        <div>
          <strong>Page Count:</strong> {pageCount}
        </div>
        
        <div className="mt-4">
          <strong>Matching Size & Color Rules:</strong> {matchingRules.length}
          {matchingRules.length > 0 && (
            <ul className="ml-4 mt-1">
              {matchingRules.map((rule, index) => (
                <li key={index} className="text-xs">
                  Size: {rule.PaperSize?.ValueName}, Color: {rule.ColorType?.ValueName}, 
                  PageRange: {rule.PageRange?.ValueName}, Price: {rule.PricePerPage}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="mt-4">
          <strong>Page Range Matches:</strong> {pageRangeMatches.length}
          {pageRangeMatches.length > 0 && (
            <ul className="ml-4 mt-1">
              {pageRangeMatches.map((rule, index) => (
                <li key={index} className="text-xs">
                  Size: {rule.PaperSize?.ValueName}, Color: {rule.ColorType?.ValueName}, 
                  PageRange: {rule.PageRange?.ValueName}, Price: {rule.PricePerPage}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {matchingRules.length === 0 && (
          <div className="mt-4 text-red-600 font-semibold">
            ❌ No matching rules found for this size and color combination!
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingRuleDebugger;
