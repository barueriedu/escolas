import pandas as pd
import re

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

# Salvar o resultado
df_final.to_csv('escolasatualizadas_novo.csv', index=False, sep=';', encoding='utf-8-sig')
print("Arquivo 'escolasatualizadas_novo.csv' gerado com sucesso.")