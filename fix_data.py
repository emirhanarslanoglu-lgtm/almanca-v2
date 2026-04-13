import os

def main():
    parts = ['data.js', 'data7.js', 'data8.js']
    all_data = []
    
    # We will read data5 and data6 again to rebuild properly
    parts_to_merge = ['data1.js', 'data2.js', 'data3.js', 'data4.js', 'data5.js', 'data6.js', 'data7.js', 'data8.js']
    
    for part in parts_to_merge:
        if os.path.exists(part):
            try:
                with open(part, 'r', encoding='utf-8') as f:
                    content = f.read()
                    start = content.find('[')
                    end = content.rfind(']')
                    if start != -1 and end != -1:
                        array_body = content[start+1:end].strip()
                        if array_body:
                            all_data.append(array_body)
            except Exception as e:
                pass
                
    final_content = "const flashcardsData = [\n  " + ",\n  ".join(all_data) + "\n];\nexport default flashcardsData;\n"
    
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(final_content)

if __name__ == '__main__':
    main()
