export interface IComponent {
	id?: string;
	type: string;
	props: Record<string, any>;
	children?: IComponent[];
}

export interface IParsedComponent {
	type: ConstructorOfATypedSvelteComponent;
	props: Record<string, any>;
	children?: IParsedComponent[];
	src: IComponent;
}

export type IComponentChild =
	| { type: 'vstack'; props?: { classes?: string } }
	| { type: 'hstack'; props?: { classes?: string } }
	| { type: 'grid'; props?: { classes?: string } }
	| { type: 'form'; props?: { classes: string } }
	| {
			type: 'datepicker';
			props: { classes?: string; name: string; label?: string; mode: 'single' | 'multiple' };
	  }
	| {
			type: 'button';
			props: { classes?: string; label?: string; cmd?: { msg?: string; args?: any } };
	  }
	| { type: 'textinput'; props: { classes?: string } };

export enum IReportParamEnums {
	'System.Int32' = 'textinput',
	'System.Int64' = 'textinput',
	'System.Double' = 'textinput',
	'System.Text' = 'textinput',
	'System.DateTime' = 'datepicker',
	'System.String' = 'textinput',
	'System.Boolean' = 'checkbox',
	'System.Decimal' = 'textinput',
	'System.TimeSpan' = 'datepicker',
	'System.Byte[]' = 'fileupload'
}

export type IReportParamTypes =
	| 'System.Int32'
	| 'System.Int64'
	| 'System.Double'
	| 'System.Text'
	| 'System.DateTime'
	| 'System.String'
	| 'System.Boolean'
	| 'System.Decimal'
	| 'System.TimeSpan'
	| 'System.Byte[]';
