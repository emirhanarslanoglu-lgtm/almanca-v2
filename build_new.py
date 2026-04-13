import os

parts = ['data1.js', 'data2.js', 'data3.js', 'data4.js', 'data5.js', 'data6.js', 'data7.js', 'data8.js', 'data9.js', 'data10.js', 'data11.js', 'data12.js', 'data13.js', 'data14.js', 'data15.js', 'data16.js', 'data17.js', 'data18.js', 'data19.js', 'data20.js']
all_data = []

for part in parts:
    if os.path.exists(part):
        with open(part, 'r', encoding='utf-8') as f:
            content = f.read()
            start = content.find('[')
            end = content.rfind(']')
            if start != -1 and end != -1:
                array_body = content[start+1:end].strip()
                if array_body:
                    all_data.append(array_body)

final_content = "const flashcardsData = [\n  " + ",\n  ".join(all_data) + "\n];\nexport default flashcardsData;\n"

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(final_content)

print(f"data.js successfully built with currently available parts.")
