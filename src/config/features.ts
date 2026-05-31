/** Feature flags — prod demo desactiva social (feed stub devuelve []). Tests mantienen social. */
export const FEATURES = {
  social_enabled:
    import.meta.env.VITE_FEATURE_SOCIAL === 'true' || import.meta.env.MODE === 'test',
} as const;
