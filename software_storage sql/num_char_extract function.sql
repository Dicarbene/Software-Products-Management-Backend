show variables like '%func%';
SET GLOBAL log_bin_trust_function_creators = 1;

DELIMITER //
DROP FUNCTION IF EXISTS Num_char_extract//
CREATE FUNCTION Num_char_extract(Varstring text CHARSET utf8, flag INT) 
RETURNS text CHARSET utf8
BEGIN
#
	DECLARE len INT DEFAULT 0;
	DECLARE Tmp text DEFAULT '';
	SET len=CHAR_LENGTH(Varstring);
	IF flag = 0 
	THEN
		WHILE len > 0 DO
		IF MID(Varstring,len,1)REGEXP'[0-9]' THEN
		SET Tmp=CONCAT(Tmp,MID(Varstring,len,1));
		END IF;
		SET len = len - 1;
		END WHILE;
	ELSEIF flag=1
	THEN
		WHILE len > 0 DO
		IF (MID(Varstring,len,1)REGEXP '[a-zA-Z]')
		THEN
		SET Tmp=CONCAT(Tmp,MID(Varstring,len,1));
		END IF;
		SET len = len - 1;
		END WHILE;
	ELSEIF flag=2
	THEN
		WHILE len > 0 DO
		IF ( (MID(Varstring,len,1)REGEXP'[0-9]')
		OR (MID(Varstring,len,1)REGEXP '[a-zA-Z]') ) 
		THEN
		SET Tmp=CONCAT(Tmp,MID(Varstring,len,1));
		END IF;
		SET len = len - 1;
		END WHILE;
	ELSEIF flag=3
	THEN
		WHILE len > 0 DO
		IF NOT (MID(Varstring,len,1)REGEXP '^[u0391-uFFE5]')
		THEN
		SET Tmp=CONCAT(Tmp,MID(Varstring,len,1));
		END IF;
		SET len = len - 1;
		END WHILE;
	ELSE 
		SET Tmp = 'Error: The second paramter should be in (0,1,2,3)';
		RETURN Tmp;
	END IF;
	RETURN REVERSE(Tmp);
END//
DELIMITER ;

#select Num_char_extract('1a天2b3下c4d无敌5e',3);