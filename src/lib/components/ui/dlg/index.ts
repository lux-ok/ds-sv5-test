import { Dialog as DialogPrimitive } from 'bits-ui';

import Title from './dialog-title.svelte';
import Footer from './dialog-footer.svelte';
import Header from './dialog-header.svelte';
import Overlay from './dialog-overlay.svelte';
import Content from './dialog-content.svelte';
import Description from './dialog-description.svelte';

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Close = DialogPrimitive.Close;
const Portal = DialogPrimitive.Portal;

export {
	Root,
	Title,
	Portal,
	Footer,
	Header,
	Trigger,
	Overlay,
	Content,
	Description,
	Close,
	//
	Root as Dlg,
	Title as DlgTitle,
	Portal as DlgPortal,
	Footer as DlgFooter,
	Header as DlgHeader,
	Trigger as DlgTrigger,
	Overlay as DlgOverlay,
	Content as DlgContent,
	Description as DlgDescription,
	Close as DlgClose
};
