-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.get_streak_multiplier(streak_dias INTEGER)
RETURNS NUMERIC 
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF streak_dias >= 30 THEN RETURN 3.0;
  ELSIF streak_dias >= 14 THEN RETURN 2.0;
  ELSIF streak_dias >= 7 THEN RETURN 1.5;
  ELSIF streak_dias >= 3 THEN RETURN 1.2;
  ELSE RETURN 1.0;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_level(pontos INTEGER)
RETURNS INTEGER 
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  nivel_ordem INTEGER;
BEGIN
  SELECT ordem INTO nivel_ordem FROM public.niveis 
  WHERE pontos_necessarios <= pontos 
  ORDER BY pontos_necessarios DESC 
  LIMIT 1;
  RETURN COALESCE(nivel_ordem, 1);
END;
$$;