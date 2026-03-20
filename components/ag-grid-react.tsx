import { AgGridReactProps, AgGridReact as OriginalAgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";

// to use myTheme in an application, pass it to the theme grid option
export const myTheme = themeQuartz.withParams({
	borderRadius: 0,
	browserColorScheme: "light",
	spacing: 8,
	wrapperBorderRadius: 0,
});

function AgGridReact(props: AgGridReactProps) {
	return <OriginalAgGridReact {...props} theme={myTheme} />;
}

export default AgGridReact;
