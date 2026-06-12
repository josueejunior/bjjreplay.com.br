import { AuthBrandingPanel } from '@/components/auth/AuthBrandingPanel';
import { AuthSiteBack } from '@/components/auth/AuthSiteBack';
import { Logo } from '@/components/brand/Logo';
import { LandingImage } from '@/components/landing/LandingImage';
import { LANDING_MEDIA } from '@/lib/landing/media';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-dvh lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Fundo mobile — mais sutil */}
      <div className="pointer-events-none absolute inset-0 lg:hidden">
        <LandingImage
          src={LANDING_MEDIA.community.grappling}
          alt=""
          grayscale
          className="h-full w-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-background/92" />
      </div>

      <AuthBrandingPanel />

      <div className="relative flex min-h-dvh flex-col px-4 pb-6 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 lg:min-h-screen lg:justify-center lg:px-12 lg:py-10 xl:px-16">
        <div className="mx-auto mb-3 w-full max-w-md lg:mb-5 lg:max-w-lg">
          <AuthSiteBack />
        </div>

        <div className="mx-auto mb-4 flex justify-center lg:hidden">
          <Logo size="sm" variant="elevated" />
        </div>

        <div className="mx-auto w-full max-w-md lg:max-w-lg">{children}</div>
      </div>
    </main>
  );
}
