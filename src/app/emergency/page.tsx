import { redirect } from 'next/navigation';

export default function EmergencyIndexPage() {
  redirect('/emergency/new');
}
