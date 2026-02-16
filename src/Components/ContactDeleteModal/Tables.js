const InvoiceTotals = ({ 
  totals, 
  colSpan = 4,
  showSubtotal = true,
  showTax = true,
  showTotal = true,
  currency = 'fr-FR'
}) => {
  const { t } = useTranslation();

  return (
    <tfoot className="table-light">
      {showSubtotal && (
        <tr>
          <td colSpan={colSpan}></td>
          <td className="fw-bold">{t("Sous-total HT")}</td>
          <td className="text-end">{totals.totalHT?.toLocaleString(currency)}</td>
          <td></td>
        </tr>
      )}
      {showTax && (
        <tr>
          <td colSpan={colSpan}></td>
          <td className="fw-bold">{t("TVA")}</td>
          <td className="text-end">{totals.totalTVA?.toLocaleString(currency)}</td>
          <td></td>
        </tr>
      )}
      {showTotal && (
        <tr>
          <td colSpan={colSpan}></td>
          <td className="fw-bold">{t("Total TTC")}</td>
          <td className="text-end fw-bold">{totals.totalTTC?.toLocaleString(currency)}</td>
          <td></td>
        </tr>
      )}
    </tfoot>
  );
};