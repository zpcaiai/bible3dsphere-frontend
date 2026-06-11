// exportVerses.js — 求赐恩言/专属讲道导出（TXT/PDF）。
// 从 App.jsx 拆出并按需 import()：导出逻辑 + jspdf/html2canvas 全部不进首包。
import { t, formatEmotionList } from './i18n/runtime'
import { verseGroupsFromResult } from './utils'
import { escapeHtml } from './sanitize'

export function exportVersesToTxt({ query, queryResult, sermon, guidance, biblicalExample, languageFilter }) {
  if (!queryResult?.verse_summary && !sermon) return
  const docTitle = sermon ? t("属灵星球 - 专属讲道") : t("属灵星球 - 求赐恩言")
  let content = `${docTitle}\n`
  content += `倾心吐意：${query}\n`
  content += `日期：${new Date().toLocaleString('zh-CN')}\n\n`

  // 添加引导信息（带小标题，与页面一致）
  if (guidance) {
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    content += `  引导信息\n`
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    if (guidance.core_emotions?.length) {
      content += `【核心情绪】\n`
      content += `${formatEmotionList(guidance.core_emotions)}\n\n`
    }
    if (guidance.psychological_assessment) {
      content += `【心理评估】\n`
      content += `${guidance.psychological_assessment}\n\n`
    }
    if (sermon?.spiritual_diagnosis) {
      content += `【属灵剖析】\n`
      content += `${sermon.spiritual_diagnosis}\n\n`
    }
    if (guidance.core_need) {
      content += `【核心需要】\n`
      content += `${guidance.core_need}\n\n`
    }
    if (guidance.spiritual_guidance) {
      content += `【属灵引导】\n`
      content += `${guidance.spiritual_guidance}\n\n`
    }
  }

  // 添加圣经例子（带小标题）
  if (biblicalExample) {
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    content += `  圣经榜样\n`
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    if (biblicalExample.person) {
      content += `人物：${biblicalExample.person}`
      if (biblicalExample.era) content += ` (${biblicalExample.era})`
      content += `\n\n`
    }
    if (biblicalExample.similar_situation) {
      content += `【相似处境】\n`
      content += `${biblicalExample.similar_situation}\n\n`
    }
    if (biblicalExample.biblical_response) {
      content += `【圣经回应】\n`
      content += `${biblicalExample.biblical_response}\n\n`
    }
    if (biblicalExample.key_verse) {
      content += `【关键经文】\n`
      content += `${biblicalExample.key_verse}\n\n`
    }
  }

  // 添加历史见证
  if (sermon?.historical_case) {
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    content += `  历史见证\n`
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    const hc = sermon.historical_case
    if (hc.person) content += `人物：${hc.person}${hc.era ? ` (${hc.era})` : ''}\n`
    if (hc.story) content += `${hc.story}\n`
    if (hc.lesson) content += `${hc.lesson}\n`
    content += `\n`
  }

  // 添加讲道内容
  if (sermon) {
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    content += `  专属讲道${sermon.title ? `：${sermon.title}` : ''}\n`
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    if (sermon.theme_verse) {
      content += `【主题经文】\n`
      content += `${sermon.theme_verse}\n\n`
    }
    if (sermon.introduction) {
      content += `【引言】\n`
      content += `${sermon.introduction}\n\n`
    }
    sermon.sections?.forEach((sec) => {
      content += `【${sec.heading}】\n`
      content += `${sec.content}\n\n`
    })
    if (sermon.application) {
      content += `【属灵操练】\n`
      const appText = Array.isArray(sermon.application)
        ? sermon.application.join('\n')
        : (typeof sermon.application === 'object' ? JSON.stringify(sermon.application, null, 2) : sermon.application)
      content += `${appText}\n\n`
    }
    if (sermon.encouragement) {
      content += `【勉励与安慰】\n`
      content += `${sermon.encouragement}\n\n`
    }
    if (sermon.prayer) {
      content += `【祝祷】\n`
      content += `${sermon.prayer}\n\n`
    }
  }

  // 添加应用建议 (合并 5 & 10)
  if (biblicalExample?.application || guidance?.coping_suggestions?.length) {
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    content += `  应用建议 (Application from Biblical Example)\n`
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    if (guidance?.coping_suggestions?.length) {
      content += `【日常应对】\n`
      content += `${guidance.coping_suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n`
    }
    if (biblicalExample?.application) {
      content += `【圣经操练】\n`
      content += `${biblicalExample.application}\n\n`
    }
  }

  // 添加结语与盼望
  if (sermon?.conclusion) {
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    content += `  结语与盼望\n`
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    content += `${sermon.conclusion}\n\n`
  }

  // 添加默想经文（放到最后）
  const groups = verseGroupsFromResult(queryResult, languageFilter)
  if (groups.length > 0) {
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    content += `  默想经文\n`
    content += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    groups.forEach(group => {
      content += `─── ${group.language === 'cuv' ? t("中文（和合本）") : 'English (ESV)'} ───\n\n`
      group.items.forEach(item => {
        content += `▸ ${item.book_name} ${item.chapter}:${item.verse}\n`
        content += `${item.raw_text}\n\n`
      })
    })
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url

  // Format filename: emotions or sermon title + datetime
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const datetime = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`

  let filenameBase
  if (guidance?.core_emotions?.length > 0) {
    // Use emotions joined by & for "求赐恩言"
    filenameBase = guidance.core_emotions.slice(0, 3).join('&')
  } else if (sermon?.title) {
    // Use sermon title for "专属讲道"
    const titleStr = typeof sermon.title === 'string' ? sermon.title : String(sermon.title)
    filenameBase = titleStr.replace(/[\\/:*?"<>|]/g, '')
  } else {
    filenameBase = t("默想经文")
  }

  a.download = `${filenameBase}_${datetime}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportVersesToPdf({ query, queryResult, sermon, guidance, biblicalExample, languageFilter }) {
  if (!queryResult?.verse_summary && !sermon) return

  // Format filename
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const datetime = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  let filenameBase
  if (guidance?.core_emotions?.length > 0) {
    filenameBase = guidance.core_emotions.slice(0, 3).join('&')
  } else if (sermon?.title) {
    const titleStr = typeof sermon.title === 'string' ? sermon.title : String(sermon.title)
    filenameBase = titleStr.replace(/[\\/:*?"<>|]/g, '')
  } else {
    filenameBase = t("默想经文")
  }
  const filename = `${filenameBase}_${datetime}.pdf`

  // PDF constants — dynamically import heavy libraries
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ])
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const margin = 10
  const contentWidth = pdfWidth - margin * 2
  const contentHeight = pdfHeight - margin * 2
  let currentY = margin
  pdf.setFillColor(14, 23, 38); pdf.rect(0, 0, pdfWidth, pdfHeight, 'F')

  // Helper to render HTML block and add to PDF with page break logic
  async function addBlockToPdf(htmlContent, isFirstPage = false) {
    const container = document.createElement('div')
    container.style.cssText = `position: fixed; left: -9999px; top: 0; width: ${contentWidth * 3.78}px; background:#0e1726; padding: 10px; font-family: "Microsoft YaHei", sans-serif; line-height: 1.6; color:#e8e8e8;`
    document.body.appendChild(container)
    container.innerHTML = htmlContent

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0e1726'
      })

      const imgHeightMm = (canvas.height / canvas.width) * contentWidth

      // Check if need new page (if not first page and won't fit)
      if (!isFirstPage && currentY + imgHeightMm > contentHeight + margin) {
        pdf.addPage()
        pdf.setFillColor(14, 23, 38); pdf.rect(0, 0, pdfWidth, pdfHeight, 'F')
        currentY = margin
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.92)
      pdf.addImage(imgData, 'JPEG', margin, currentY, contentWidth, imgHeightMm)
      currentY += imgHeightMm + 2 // 2mm gap between blocks

      // If this block is larger than a full page, handle pagination
      if (imgHeightMm > contentHeight) {
        // Content spans multiple pages - the addImage above already clipped to first page
        // Now we need to add the rest on subsequent pages
        let remainingHeight = imgHeightMm - contentHeight
        let offset = contentHeight

        while (remainingHeight > 0) {
          pdf.addPage()
          pdf.setFillColor(14, 23, 38); pdf.rect(0, 0, pdfWidth, pdfHeight, 'F')
          pdf.addImage(imgData, 'JPEG', margin, margin - offset, contentWidth, imgHeightMm)
          offset += contentHeight
          remainingHeight -= contentHeight
        }
        currentY = margin + (imgHeightMm % contentHeight)
      }

      document.body.removeChild(container)
      return imgHeightMm
    } catch (err) {
      document.body.removeChild(container)
      throw err
    }
  }

  try {
    // Header block
    const pdfTitle = sermon ? t("属灵星球 - 专属讲道") : t("属灵星球 - 求赐恩言")
    await addBlockToPdf(`
      <h1 style="font-size: 20px; color: #007aff; margin: 0 0 10px 0;">${pdfTitle}</h1>
      <div style="font-size: 12px; color:#9a9a9a; margin-bottom: 5px;">倾心吐意：${escapeHtml(query)}<br>日期：${new Date().toLocaleString('zh-CN')}</div>
    `, true)

    // Guidance block
    if (guidance) {
      let guidanceHtml = t("<div style=\"margin: 6px 0;\"><div style=\"font-size: 14px; font-weight: bold; color: #444; margin-bottom: 4px; border-bottom: 1px solid #2e3c52; padding-bottom: 3px;\">引导信息</div><div style=\"background: rgba(0,122,255,0.15); padding: 10px; border-radius: 8px; border: 1px solid rgba(0,122,255,0.25); color:#f0f0f0;\">")
      if (guidance.core_emotions?.length) {
        guidanceHtml += `<div style="margin-bottom:8px;"><strong style="color:#5ea0ff;">${t("核心情绪：")}</strong>${formatEmotionList(guidance.core_emotions)}</div>`
      }
      if (guidance.psychological_assessment) {
        guidanceHtml += `<div style="margin:12px 0;"><strong style="color:#5ea0ff;">心理评估</strong><div style="margin-top:6px;color:rgba(255,255,255,0.88);">${guidance.psychological_assessment.replace(/\n/g, '<br>')}</div></div>`
      }
      if (sermon?.spiritual_diagnosis) {
        guidanceHtml += `<div style="margin:12px 0;"><strong style="color:#5ea0ff;">属灵剖析</strong><div style="margin-top:6px;color:rgba(255,255,255,0.88);">${sermon.spiritual_diagnosis.replace(/\n/g, '<br>')}</div></div>`
      }
      if (guidance.core_need) {
        guidanceHtml += `<div style="margin-bottom:8px;"><strong style="color:#5ea0ff;">核心需要：</strong>${guidance.core_need}</div>`
      }
      if (guidance.spiritual_guidance) {
        guidanceHtml += `<div style="margin:12px 0;"><strong style="color:#5ea0ff;">属灵引导</strong><div style="margin-top:6px;color:rgba(255,255,255,0.88);">${guidance.spiritual_guidance.replace(/\n/g, '<br>')}</div></div>`
      }
      guidanceHtml += '</div></div>'
      await addBlockToPdf(guidanceHtml)
    }

    // Biblical example block
    if (biblicalExample) {
      let exampleHtml = t("<div style=\"margin: 6px 0;\"><div style=\"font-size: 14px; font-weight: bold; color: #444; margin-bottom: 4px; border-bottom: 1px solid #2e3c52; padding-bottom: 3px;\">圣经例子</div><div style=\"background: rgba(0,122,255,0.15); padding: 10px; border-radius: 8px; border: 1px solid rgba(0,122,255,0.25); color:#f0f0f0;\">")
      if (biblicalExample.person) {
        exampleHtml += `<div style="margin-bottom:8px;"><strong style="color:#5ea0ff;">人物：</strong>${biblicalExample.person}${biblicalExample.era ? ` (${biblicalExample.era})` : ''}</div>`
      }
      if (biblicalExample.similar_situation) {
        exampleHtml += `<div style="margin:12px 0;"><strong style="color:#5ea0ff;">相似处境</strong><div style="margin-top:6px;">${biblicalExample.similar_situation.replace(/\n/g, '<br>')}</div></div>`
      }
      if (biblicalExample.biblical_response) {
        exampleHtml += `<div style="margin:12px 0;"><strong style="color:#5ea0ff;">圣经回应</strong><div style="margin-top:6px;">${biblicalExample.biblical_response.replace(/\n/g, '<br>')}</div></div>`
      }
      if (biblicalExample.key_verse) {
        exampleHtml += `<div style="margin:12px 0;"><strong style="color:#5ea0ff;">关键经文</strong><div style="margin-top:6px;font-style:italic;color:rgba(255,255,255,0.88);">${biblicalExample.key_verse}</div></div>`
      }
      exampleHtml += '</div></div>'
      await addBlockToPdf(exampleHtml)
    }

    // 8. Historical case block
    if (sermon?.historical_case) {
      const hc = sermon.historical_case
      const caseHtml = `<div style="margin: 6px 0; background: rgba(0,122,255,0.15); padding: 10px; border-radius: 8px; border: 1px solid rgba(0,122,255,0.25);"><div style="font-size: 14px; font-weight: bold; color: #444; margin-bottom: 4px; border-bottom: 1px solid #2e3c52; padding-bottom: 3px;">历史见证</div><strong style="color:#5ea0ff;">${hc.person || ''}${hc.era ? ` (${hc.era})` : ''}</strong><p style="color:rgba(255,255,255,0.88);margin:6px 0 0 0;">${hc.story?.replace(/\n/g, '<br>') || ''}</p>${hc.lesson ? `<p style="color:rgba(255,255,255,0.7);margin-top:6px;font-style:italic;">${hc.lesson}</p>` : ''}</div>`
      await addBlockToPdf(caseHtml)
    }

    // 9. Sermon blocks
    if (sermon) {
      // Title block
      await addBlockToPdf(`<div style="margin: 6px 0; background: rgba(88,86,214,0.2); padding: 10px; border-radius: 8px; border: 1px solid rgba(88,86,214,0.35);"><div style="font-size: 16px; font-weight: bold; color: #5b21b6; margin-bottom: 4px;">专属讲道：${sermon.title || ''}</div>${sermon.theme_verse ? `<div style="font-style:italic;margin-bottom:12px;color:rgba(255,255,255,0.7);">${sermon.theme_verse}</div>` : ''}</div>`)

      if (sermon.introduction) {
        await addBlockToPdf(`<div style="margin: 6px 0; background: rgba(88,86,214,0.2); padding: 10px; border-radius: 8px; border: 1px solid rgba(88,86,214,0.35);"><p style="color:#f0f0f0;margin:0;">${sermon.introduction.replace(/\n/g, '<br>')}</p></div>`)
      }

      // Each section
      if (sermon.sections) {
        for (const sec of sermon.sections) {
          const sectionHtml = `<div style="margin: 6px 0; background: rgba(88,86,214,0.2); padding: 10px; border-radius: 8px; border: 1px solid rgba(88,86,214,0.35);"><strong style="color:#6d28d9;">${sec.heading}</strong><p style="color:rgba(255,255,255,0.88);margin:6px 0 0 0;">${sec.content.replace(/\n/g, '<br>')}</p></div>`
          await addBlockToPdf(sectionHtml)
        }
      }

      if (sermon.application) {
        const appHtml = Array.isArray(sermon.application)
          ? `<ol style="padding-left:20px;margin:0;">${sermon.application.map(a => `<li style="margin:4px 0;">${a}</li>`).join('')}</ol>`
          : `<p style="margin:0;">${sermon.application.replace(/\n/g, '<br>')}</p>`
        await addBlockToPdf(`<div style="margin: 6px 0; background: rgba(88,86,214,0.2); padding: 10px; border-radius: 8px; border: 1px solid rgba(88,86,214,0.35);"><strong style="color:#6d28d9;">属灵操练</strong><div style="color:rgba(255,255,255,0.88);margin-top:6px;">${appHtml}</div></div>`)
      }

      if (sermon.encouragement) {
        await addBlockToPdf(`<div style="margin: 6px 0; background: rgba(88,86,214,0.2); padding: 10px; border-radius: 8px; border: 1px solid rgba(88,86,214,0.35);"><strong style="color:#6d28d9;">勉励与安慰</strong><p style="color:rgba(255,255,255,0.88);margin:6px 0 0 0;">${sermon.encouragement.replace(/\n/g, '<br>')}</p></div>`)
      }
      if (sermon.prayer) {
        await addBlockToPdf(`<div style="margin: 6px 0; background: rgba(88,86,214,0.2); padding: 10px; border-radius: 8px; border: 1px solid rgba(88,86,214,0.35);"><strong style="color:#6d28d9;">祝祷</strong><p style="color:rgba(255,255,255,0.88);margin:6px 0 0 0;font-style:italic;">${sermon.prayer.replace(/\n/g, '<br>')}</p></div>`)
      }
    }

    // 10. Application block (Merged)
    if (biblicalExample?.application || guidance?.coping_suggestions?.length) {
      let appHtml = `<div style="margin: 6px 0; background: rgba(0,122,255,0.15); padding: 10px; border-radius: 8px; border: 1px solid rgba(0,122,255,0.25);"><div style="font-size: 14px; font-weight: bold; color: #444; margin-bottom: 4px; border-bottom: 1px solid #2e3c52; padding-bottom: 3px;">应用建议 (Application from Biblical Example)</div>`
      if (guidance?.coping_suggestions?.length) {
        appHtml += `<div style="margin-bottom:10px;"><strong style="color:#5ea0ff;">日常应对</strong><ul style="margin:6px 0;padding-left:20px;color:rgba(255,255,255,0.88);">${guidance.coping_suggestions.map(s => `<li style="margin:4px 0;">${s}</li>`).join('')}</ul></div>`
      }
      if (biblicalExample?.application) {
        appHtml += `<div><strong style="color:#5ea0ff;">圣经操练</strong><div style="color:rgba(255,255,255,0.88);margin-top:4px;">${biblicalExample.application.replace(/\n/g, '<br>')}</div></div>`
      }
      appHtml += '</div>'
      await addBlockToPdf(appHtml)
    }

    // 11. Conclusion block
    if (sermon?.conclusion) {
      await addBlockToPdf(`<div style="margin: 6px 0; background: rgba(88,86,214,0.2); padding: 10px; border-radius: 8px; border: 1px solid rgba(88,86,214,0.35);"><strong style="color:#6d28d9;">结语与盼望</strong><p style="color:rgba(255,255,255,0.88);margin:6px 0 0 0;">${sermon.conclusion.replace(/\n/g, '<br>')}</p></div>`)
    }

    // 12. Meditated Verses block
    const groups = verseGroupsFromResult(queryResult, languageFilter)
    if (groups.length > 0) {
      let versesHtml = t("<div style=\"margin: 6px 0;\"><div style=\"font-size: 14px; font-weight: bold; color: #444; margin-bottom: 4px; border-bottom: 1px solid #2e3c52; padding-bottom: 3px;\">默想经文</div>")
      groups.forEach(group => {
        versesHtml += `<div style="margin: 8px 0 4px; font-size: 12px; color:#9a9a9a; font-weight: 600;">${group.language === 'cuv' ? t("中文（和合本）") : 'English (ESV)'}</div>`
        group.items.forEach(item => {
          versesHtml += `
            <div style="margin: 6px 0; padding: 10px; background:#1a2433; border-radius: 8px; border: 1px solid #2e3c52;">
              <div style="font-size: 11px; color: #007aff; font-weight: 600;">${item.book_name} ${item.chapter}:${item.verse}</div>
              <div style="font-size: 13px; margin-top: 4px; color:#f0f0f0;">${item.raw_text}</div>
            </div>
          `
        })
      })
      versesHtml += '</div>'
      await addBlockToPdf(versesHtml)
    }

    
    // Watermark on all pages
    const totalPages = pdf.internal.getNumberOfPages()
    for (let pg = 1; pg <= totalPages; pg++) {
      pdf.setPage(pg)
      pdf.setFontSize(9)
      pdf.setTextColor(180, 180, 180)
      pdf.text('https://holiness.uk/', pdfWidth / 2, pdfHeight - 4, { align: 'center' })
    }
    pdf.save(filename)
  } catch (err) {
    console.error('PDF generation failed:', err)
    alert(t("PDF 生成失败，请重试"))
  }
}
