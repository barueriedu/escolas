import pandas as pd
import re
import unicodedata

# Carregar o arquivo (tentando encodings comuns)
encodings_tentados = ['utf-8', 'utf-8-sig', 'cp1252', 'latin1']
for enc in encodings_tentados:
    try:
        df = pd.read_csv('escolasatualizada.csv', sep=';', encoding=enc, dtype=str)
        df = df.fillna("")
        print(f"CSV lido com encoding: {enc}")
        break
    except UnicodeDecodeError:
        pass
else:
    raise RuntimeError("Falha ao ler CSV com os encodings testados.")

def extrair_dados_corrigido(linha):
    tel1 = str(linha['TELEFONE 1']).strip() if pd.notna(linha['TELEFONE 1']) else ""
    tel2 = str(linha['TELEFONE 2']).strip() if pd.notna(linha['TELEFONE 2']) else ""
    
    telefones_encontrados, ramais_encontrados = [], []
    
    # --- AQUI ENTRA A CORREÇÃO DA REGEX ---
    # Aceita números com traço, espaço ou sem separador
    regex_tel = r'(\d{4,5}[-\s]\d{4}|\d{8,11})' 
    
    for campo in [tel1, tel2]:
        if not campo or campo.lower() == 'nan' or '****' in campo:
            continue
            
        if 'ramal' in campo.lower() or 'ramais' in campo.lower():
            # Trata intervalos "X a Y"
            intervalo = re.search(r'(\d+)\s+a\s+(\d+)', campo, re.IGNORECASE)
            if intervalo:
                inicio, fim = map(int, intervalo.groups())
                ramais_encontrados.extend([str(i) for i in range(inicio, fim + 1)])
            else:
                # Extrai números de ramal (3 a 5 dígitos)
                ramais_encontrados.extend(re.findall(r'\d{3,5}', campo))
        else:
            # --- AQUI ENTRA A CORREÇÃO DO LOOP ---
            encontrados = re.findall(regex_tel, campo)
            # Padroniza trocando espaço por traço e adiciona à lista
            telefones_encontrados.extend([t.replace(' ', '-') for t in encontrados])
            
    # Remove duplicatas mantendo a ordem
    tels_final = ", ".join(dict.fromkeys(telefones_encontrados))
    rams_final = ", ".join(dict.fromkeys(ramais_encontrados))
            
    return tels_final, rams_final

def normalize_text(value):
    if pd.isna(value):
        return ""
    text = str(value).strip().lower()
    text = unicodedata.normalize('NFD', text)
    text = re.sub(r'[\u0300-\u036f]', '', text)
    text = re.sub(r'[^a-z0-9 ]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

integral_schools = {
    normalize_text('EMEF Ézio Berzaghi'),
    normalize_text('EMEF Renato Rosa'),
    normalize_text('EMEF Nestor de Camargo'),
    normalize_text('EMEIEF Eneias Raimundo da Silva'),
    normalize_text('EMEF Carlos Osmarinho'),
    normalize_text('EMEF Egídio Costa'),
}

def flag_integral(escola):
    escola_normalizada = normalize_text(escola)
    return 'S' if any(nome in escola_normalizada for nome in integral_schools) else 'N'

# Aplicar a lógica criando as novas colunas
df[['Telefones', 'Ramais']] = df.apply(lambda x: pd.Series(extrair_dados_corrigido(x)), axis=1)

# Reordenar as colunas: colocar "Telefones" e "Ramais" no lugar de "TELEFONE 1" e "TELEFONE 2"
colunas = df.columns.tolist()
idx_tel1 = colunas.index('TELEFONE 1')

# Remover as colunas antigas da lista
colunas.remove('TELEFONE 1')
colunas.remove('TELEFONE 2')

# Inserir as novas colunas no mesmo lugar onde estava TELEFONE 1
colunas.insert(idx_tel1, 'Telefones')
colunas.insert(idx_tel1 + 1, 'Ramais')

# Reordenar o dataframe
df_final = df[colunas]

# Remover qualquer coluna duplicada mantendo a primeira ocorrência
df_final = df_final.loc[:, ~df_final.columns.duplicated(keep='first')]

# Adicionar flag Integral para filtro na aplicação
if 'ESCOLA' in df_final.columns:
    df_final['Integral'] = df_final['ESCOLA'].apply(flag_integral)
else:
    df_final['Integral'] = 'N'

# Salvar o resultado
df_final.to_csv('escolasatualizadas_novo.csv', index=False, sep=';', encoding='utf-8-sig')
print("Arquivo 'escolasatualizadas_novo.csv' gerado com sucesso.")