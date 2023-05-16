CREATE OR REPLACE FUNCTION normalize_arabic(input_string IN text) RETURNS text AS $$
DECLARE
normalized_char text;
BEGIN
    normalized_char = regexp_replace(input_string, E'[\u064b-\u065f]', '', 'g');
RETURN CASE normalized_char
           WHEN 'آ' THEN 'ا'
           WHEN 'أ' THEN 'ا'
           WHEN 'إ' THEN 'ا'
           WHEN 'ؤ' THEN 'و'
           WHEN 'ئ' THEN 'ي'
           WHEN 'ة' THEN 'ه'
           WHEN 'ى' THEN 'ي'
           WHEN 'ا' THEN 'ا'
           WHEN 'ب' THEN 'ب'
           WHEN 'ت' THEN 'ت'
           WHEN 'ث' THEN 'ث'
           WHEN 'ج' THEN 'ج'
           WHEN 'ح' THEN 'ح'
           WHEN 'خ' THEN 'خ'
           WHEN 'د' THEN 'د'
           WHEN 'ذ' THEN 'ذ'
           WHEN 'ر' THEN 'ر'
           WHEN 'ز' THEN 'ز'
           WHEN 'س' THEN 'س'
           WHEN 'ش' THEN 'ش'
           WHEN 'ص' THEN 'ص'
           WHEN 'ض' THEN 'ض'
           WHEN 'ط' THEN 'ط'
           WHEN 'ظ' THEN 'ظ'
           WHEN 'ع' THEN 'ع'
           WHEN 'غ' THEN 'غ'
           WHEN 'ف' THEN 'ف'
           WHEN 'ق' THEN 'ق'
           WHEN 'ك' THEN 'ك'
           WHEN 'ل' THEN 'ل'
           WHEN 'م' THEN 'م'
           WHEN 'ن' THEN 'ن'
           WHEN 'ه' THEN 'ه'
           WHEN 'و' THEN 'و'
           WHEN 'ي' THEN 'ي'
           ELSE normalized_char
    END;
END;
$$ LANGUAGE plpgsql;
