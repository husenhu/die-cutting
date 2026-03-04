export interface LayoutSettings {
  labelWidth: number;
  labelHeight: number;
  gapHorizontal: number;
  gapVertical: number;
  sheetWidth: number;
  sheetHeight: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  totalQuantity: number;
  showCutLines: boolean;
  showPerforation: boolean;
}

export interface CalculatedLayout {
  labelsPerRow: number;
  labelsPerColumn: number;
  labelsPerPage: number;
  totalPages: number;
  actualWidthUsed: number;
  actualHeightUsed: number;
}
