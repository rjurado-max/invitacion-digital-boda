import InvitationClient from "@/components/InvitationClient";
import { getGuestByToken } from "@/actions/guest-actions";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function InvitationPage({ params }: Props) {
  const { token } = await params;
  const guest = await getGuestByToken(token);

  return <InvitationClient token={token} guest={guest} />;
}