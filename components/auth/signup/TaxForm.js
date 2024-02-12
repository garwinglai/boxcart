import React, { useState, useEffect } from "react";
import SearchableDropdown from "@/components/global/designs/SearchableDropdown";
import BoxLoader from "@/components/global/loaders/BoxLoader";

function TaxForm({
  setDefaultTaxCode,
  defaultProductTaxCodeName,
  defaultProductTaxCode,
  isInAppForm,
}) {
  const [taxCodes, setTaxCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taxCodes.length > 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchTaxCodes = async () => {
      try {
        const response = await fetch("/api/public/stripe/tax-codes");
        const data = await response.json();

        setTaxCodes(data.taxCodes);
      } catch (error) {
        console.error("Error fetching product tax codes:", error);
      }

      setLoading(false);
    };
    fetchTaxCodes();
  }, []);

  const filteredTaxCodes = [{ id: "", name: "- View tax codes" }]
    .concat(
      taxCodes?.filter((taxCode) =>
        taxCode.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectOption = (e) => {
    const { value } = e.target;
    if (!value) return;

    setDefaultTaxCode(JSON.parse(value));

    // Perform actions based on selected option
  };

  return (
    <div>
      {isInAppForm ? (
        <h2 className="text-black mb-4 font-medium">
          Default product tax code.
        </h2>
      ) : (
        <h2 className="text-black mb-4 font-medium">
          Select your default product tax code.
        </h2>
      )}
      <p className="text-sm">
        <strong>Read carefully. </strong>
      </p>
      <p className="text-sm mt-4">
        We automatically calculate sales tax on your behalf according to the tax
        code you select below. This will be your shop&apos;s default product tax
        code.
      </p>
      <p className="text-sm mt-4">
        We will use your default tax code to calculate sales tax for all product
        sales. If you sell products that fall under multiple tax codes, you can
        update each product individually in your account.
      </p>
      <p className="text-sm mt-4">
        It&apos;s important to select the correct default tax code for your
        products. If the incorrect tax code is selected, you may be liable for
        any underpaid sales tax plus any penalties and interest.
      </p>

      {loading ? (
        <div className="flex flex-col gap-4 items-center mt-8">
          <BoxLoader />
          <p>One sec, loading tax codes...</p>
        </div>
      ) : (
        <React.Fragment>
          <div className="mt-8 relative">
            <SearchableDropdown
              searchTerm={searchTerm}
              handleSelectOption={handleSelectOption}
              handleSearchTermChange={handleSearchTermChange}
              selectedTaxCode={defaultProductTaxCodeName}
              options={filteredTaxCodes}
            />
          </div>
          <div className="flex flex-col items-start gap-2 mt-4 border p-2 bg-gray-200 rounded">
            <p className="font-light text-sm min-w-fit">Selected Tax Code:</p>
            <p className="font-medium">
              {defaultProductTaxCodeName
                ? `${defaultProductTaxCodeName} - ${defaultProductTaxCode}`
                : "Nothing selected."}
            </p>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default TaxForm;
